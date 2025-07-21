const { TwitterApi } = require('twitter-api-v2');
const AWS = require('aws-sdk');
const axios = require('axios');

AWS.config.update({ region: 'us-east-1' });
const s3 = new AWS.S3();

const twitterClient = new TwitterApi({
  appKey: process.env.CONSUMER_KEY,
  appSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessSecret: process.env.TOKEN_SECRET,
});

const GRAPHQL_ENDPOINT = process.env.GRAPHQL_ENDPOINT;
const GRAPHQL_API_KEY = process.env.GRAPHQL_API_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME;

const query = /* GraphQL */ `
  query ListRecentDogs {
    dogByDate(type: "Dog", sortDirection: DESC, limit: 3) {
      items {
        id
        name
        breed
        price
        gender
        location
        state
        description
        imageUrls
      }
    }
  }
`;

async function fetchRecentListings() {
  const res = await axios({
    url: GRAPHQL_ENDPOINT,
    method: 'POST',
    headers: {
      'x-api-key': GRAPHQL_API_KEY,
    },
    data: { query },
  });

  return res.data.data.dogByDate.items;
}

async function getImageFromS3(imageKey) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: `public/${imageKey}`,
  };
  const image = await s3.getObject(params).promise();
  return image.Body;
}

exports.handler = async () => {
  try {
    const listings = await fetchRecentListings();

    for (const dog of listings) {
      const { id, name, breed, price, gender, location, state, imageUrls } = dog;

      const tweetContent = `${name}, a ${gender.toLowerCase()} ${breed} from ${location}, ${state}, is looking for a loving home! 🐶🏡 Rehoming fee: $${price}. More details: littlepawsplace.com/dogs/${id} #LittlePawsPlace #AdoptDontShop`;

      if (imageUrls && imageUrls.length > 0) {
        const imageBuffer = await getImageFromS3(imageUrls[0]);

        const mediaId = await twitterClient.v1.uploadMedia(imageBuffer, {
          mimeType: 'image/jpeg',
        });

        await twitterClient.v2.tweet({
          text: tweetContent,
          media: { media_ids: [mediaId] },
        });

      } else {
        await twitterClient.v2.tweet(tweetContent);
      }

      console.log(`Tweeted successfully: ${name}`);
    }

  } catch (error) {
    console.error('Error posting to Twitter:', error);
  }
};
