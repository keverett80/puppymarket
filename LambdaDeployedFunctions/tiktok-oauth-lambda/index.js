const axios = require('axios');
const AWS = require('aws-sdk');

const secretsManager = new AWS.SecretsManager();

const CLIENT_KEY = process.env.TIKTOK_CLIENT_KEY;
const CLIENT_SECRET = process.env.TIKTOK_CLIENT_SECRET;
const REDIRECT_URI = 'https://pzu4vv28bg.execute-api.us-east-1.amazonaws.com/default/handleTikTokOAuth';
const FRONTEND_REDIRECT = 'https://www.littlepawsplace.com/dashboard';

exports.handler = async (event) => {
  const query = event.queryStringParameters || {};
  const code = query.code;

  if (!code) {
    return {
      statusCode: 400,
      body: 'Missing code from TikTok OAuth response.',
    };
  }

  try {
    const response = await axios.post(
      'https://open.tiktokapis.com/v2/oauth/token/',
      {
        client_key: CLIENT_KEY,
        client_secret: CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const tokenData = response.data?.data;

    if (!tokenData || !tokenData.access_token) {
      console.error('Unexpected TikTok response:', response.data);
      return {
        statusCode: 502,
        body: JSON.stringify({ error: 'Failed to get access token', details: response.data }),
      };
    }

    const { access_token, refresh_token, expires_in, open_id } = tokenData;

    const secretName = `tiktok-access-${open_id}`;
    const secretPayload = JSON.stringify({
      access_token,
      refresh_token,
      expires_in,
      open_id,
      stored_at: new Date().toISOString(),
    });

    await secretsManager
      .createSecret({ Name: secretName, SecretString: secretPayload })
      .promise()
      .catch(async (err) => {
        if (err.code === 'ResourceExistsException') {
          await secretsManager
            .putSecretValue({ SecretId: secretName, SecretString: secretPayload })
            .promise();
        } else {
          throw err;
        }
      });

    console.log('✅ Token stored for TikTok user:', open_id);

    return {
      statusCode: 302,
      headers: {
        Location: `${FRONTEND_REDIRECT}?connected=true`,
      },
    };
  } catch (err) {
    console.error('❌ TikTok OAuth error:', err.response?.data || err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'OAuth failed',
        reason: err.response?.data || err.message,
      }),
    };
  }
};
