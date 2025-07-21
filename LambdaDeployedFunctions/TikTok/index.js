
const AWS = require('aws-sdk');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const secretsManager = new AWS.SecretsManager();
const s3 = new AWS.S3();
const BUCKET = "littlepawsplace-tiktok-videos";
const READY_PREFIX = "ready/";
const META_PREFIX = "metadata/";
const POSTED_PREFIX = "posted/";
const REGION = "us-east-1";

exports.handler = async () => {
  try {
    const videoKey = await getNextVideoKey();
    if (!videoKey) {
      console.log("No videos to post.");
      return;
    }

    const baseName = path.basename(videoKey, ".mp4");
    const metaKey = META_PREFIX + baseName + ".json";
    const metadata = await getMetadata(metaKey);
    const videoPath = "/tmp/video.mp4";

    await downloadFromS3(videoKey, videoPath);
    const tokenData = await getTikTokToken();
    const accessToken = tokenData.access_token;

    const initRes = await axios.post(
      "https://open.tiktokapis.com/v2/video/init/",
      {
        video_meta: {
          title: metadata.title,
          description: metadata.caption,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const uploadUrl = initRes.data.data.upload_url;
    const videoId = initRes.data.data.video_id;

    await uploadVideoToTikTok(uploadUrl, videoPath);
    await publishTikTokVideo(accessToken, videoId);

    await moveToPosted(videoKey);
    console.log(`✅ Posted ${baseName} to TikTok`);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message || err);
  }
};

async function getNextVideoKey() {
  const listed = await s3.listObjectsV2({ Bucket: BUCKET, Prefix: READY_PREFIX }).promise();
  const video = listed.Contents.find(obj => obj.Key.endsWith(".mp4"));
  return video ? video.Key : null;
}

async function getMetadata(key) {
  const res = await s3.getObject({ Bucket: BUCKET, Key: key }).promise();
  return JSON.parse(res.Body.toString());
}

async function downloadFromS3(key, localPath) {
  const res = await s3.getObject({ Bucket: BUCKET, Key: key }).promise();
  fs.writeFileSync(localPath, res.Body);
}

async function uploadVideoToTikTok(uploadUrl, filePath) {
  const data = fs.readFileSync(filePath);
  await axios.put(uploadUrl, data, {
    headers: { "Content-Type": "video/mp4" },
  });
}

async function publishTikTokVideo(accessToken, videoId) {
  await axios.post("https://open.tiktokapis.com/v2/video/publish/", {
    video_id: videoId,
  }, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
}

async function getTikTokToken() {
  const secrets = await secretsManager.listSecrets().promise();
  const secret = secrets.SecretList.find(s => s.Name.startsWith("tiktok-access-"));
  if (!secret) throw new Error("No TikTok access token found.");
  const secretValue = await secretsManager.getSecretValue({ SecretId: secret.Name }).promise();
  return JSON.parse(secretValue.SecretString);
}

async function moveToPosted(key) {
  const destKey = key.replace(READY_PREFIX, POSTED_PREFIX);
  await s3.copyObject({
    Bucket: BUCKET,
    CopySource: `${BUCKET}/${key}`,
    Key: destKey,
  }).promise();
  await s3.deleteObject({ Bucket: BUCKET, Key: key }).promise();
}
