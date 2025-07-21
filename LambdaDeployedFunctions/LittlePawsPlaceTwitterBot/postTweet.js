const { TwitterApi } = require('twitter-api-v2');

const twitterClient = new TwitterApi({
  appKey: process.env.CONSUMER_KEY,
  appSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.TOKEN_SECRET,
});

async function getAuthenticatedUser() {
  try {
    const user = await twitterClient.v2.me();
    console.log("Authenticated as:", user.data.username);
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
  }
}

async function postTweet(content, imageUrl = null) {
  try {
    getAuthenticatedUser();

    let mediaId;
    // If an image URL is provided, upload the image first
    if (imageUrl) {
      const mediaData = await twitterClient.v1.uploadMedia(imageUrl);
      mediaId = mediaData.media_id_string;
    }

    // Create the tweet with or without an image
    const tweetData = mediaId ? { text: content, media: { media_ids: [mediaId] } } : { text: content };
    await twitterClient.v2.tweet(tweetData);

    console.log("Tweet posted successfully");
  } catch (error) {
    console.error("Error posting tweet:", error);
  }
}

module.exports = postTweet;
