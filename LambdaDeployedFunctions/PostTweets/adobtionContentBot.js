// adoptionContentBot.js
// AWS Lambda handler to generate and tweet educational adoption content for any animal.

const OpenAI = require('openai');
const postTweet = require('./postTweet');  // your existing postTweet module

// Initialize the OpenAI API client
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

/**
 * Lambda entry point.
 * Expects event.body = { "animal": string } or { "animals": [string] }.
 */
exports.handler = async (event) => {
  let body;
  try {
    body = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
  } catch (err) {
    console.error('Invalid JSON body:', err);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON in request body' }),
    };
  }

  const animals = Array.isArray(body.animals)
    ? body.animals
    : (body.animal ? [body.animal] : []);

  if (!animals.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Please provide an \\"animal\\" or \\"animals\\" in the request.' }),
    };
  }

  const results = [];
  for (const animal of animals) {
    try {
      // Build prompt for any animal
      const prompt = `Provide a concise, engaging tweet (under 280 characters) about adopting a ${animal}. ` +
                     `Include key care tips, habitat requirements, and a responsible adoption call-to-action. ` +
                     `Use relevant hashtags.`;

      const completion = await openai.completions.create({
        model: 'gpt-3.5-turbo-instruct',
        prompt,
        max_tokens: 60,
      });

      let tweetText = completion.choices[0].text.trim();
      if (tweetText.length > 279) {
        tweetText = tweetText.substring(0, 278) + '…';
      }

      await postTweet(tweetText);
      console.log(`Posted adoption info for: ${animal}`);
      results.push({ animal, status: 'tweeted', text: tweetText });
    } catch (error) {
      console.error(`Error processing ${animal}:`, error);
      results.push({ animal, status: 'error', error: error.message });
    }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ results }),
  };
};
