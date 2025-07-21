const OpenAI = require('openai');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { TwitterApi } = require('twitter-api-v2');
const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-east-1' }); // Replace with your S3 bucket's region
const s3 = new AWS.S3();




// Initialize the OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Initialize Twitter client
const twitterClient = new TwitterApi({
  appKey: process.env.CONSUMER_KEY,
  appSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.TOKEN_SECRET,
});

const instagramAccessToken = process.env.INSTAGRAM_ACCESS_TOKEN;

async function uploadImageToS3(imagePath, bucketName) {
  const imageBuffer = fs.readFileSync(imagePath);
  // Include the 'public/' prefix in the key
  const imageKey = `public/${path.basename(imagePath)}`;

  const params = {
      Bucket: bucketName,
      Key: imageKey,
      Body: imageBuffer,
      ACL: 'public-read' // Grants public read access
  };

  await s3.putObject(params).promise();
  return `https://${bucketName}.s3.amazonaws.com/${imageKey}`;
}



async function createInstagramMediaContainer(accessToken, mediaUrl, caption) {
  const mediaContainerResponse = await axios.post(`https://graph.facebook.com/v18.0/17841464347396107/media`, {
    image_url: mediaUrl,
    caption: caption,
    access_token: accessToken
  });

  return mediaContainerResponse.data.id; // IG Container ID
}



async function publishInstagramMedia(accessToken, containerId) {
  await axios.post(`https://graph.facebook.com/v18.0/17841464347396107/media_publish`, {
    creation_id: containerId,
    access_token: accessToken
  });
}


async function generatePuppyContent(question) {
  const puppyPrompt = `Provide a brief tip or insight about ${question}, suitable for dog owners. Focus on care, feeding, or a specific dog breed. Keep it under 280 characters for a tweet, including hashtags. End with a mention of littlepawsplace.com for more info. Engage the audience in a friendly tone.`;

  const twitterCharacterLimit = 280;
  const urlLength = 23; // Approximate length of a shortened URL

  try {
    const textResponse = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      prompt: puppyPrompt,
      max_tokens: 60,
    });

    let tweetContent = textResponse.choices[0].text.trim();

    if (Math.random() < 0.10) {
      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: "Create an image of a random dog breed with a brief explanation of the breed.",
        n: 1,
        size: "1024x1024",
      });

      if (imageResponse && imageResponse.data && imageResponse.data[0]) {
        const imageUrl = imageResponse.data[0].url;
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'utf-8');


        // Save the image in the /tmp directory
        const imagePath = path.join('/tmp', 'tempImage.png');
        fs.writeFileSync(imagePath, buffer);

        const mediaId = await twitterClient.v1.uploadMedia(imagePath, { mimeType: 'image/png' });

        // Check if tweet content plus URL exceeds the limit
        if (tweetContent.length > twitterCharacterLimit - urlLength) {
          // Truncate tweet content to fit within the limit
          tweetContent = tweetContent.substring(0, twitterCharacterLimit - urlLength - 1) + "…";
      }

      await twitterClient.v2.tweet({ text: tweetContent, media: { media_ids: [mediaId] } });
      console.log("Tweet with image posted successfully");

        const bucketName = 'puppymarketplaces155206-dev';
        const publicImageUrl = await uploadImageToS3(imagePath, bucketName);

        // Now you can use `publicImageUrl` for Instagram
        const containerId = await createInstagramMediaContainer(instagramAccessToken, publicImageUrl, tweetContent);
        await publishInstagramMedia(instagramAccessToken, containerId);
        console.log("Image posted to Instagram successfully");

        fs.unlinkSync(imagePath);
      } else {
        console.error('Image generation did not return expected data');
      }
    } else {
      if (tweetContent.length > twitterCharacterLimit) {
        tweetContent = tweetContent.substring(0, twitterCharacterLimit - 1) + "…";
      }
      await twitterClient.v2.tweet({ text: tweetContent });
      console.log("Text-only tweet posted successfully");
    }
  } catch (error) {
    console.error("Error generating Puppy content:", error);
  }
}

module.exports = generatePuppyContent;
