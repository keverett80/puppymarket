//require('dotenv').config();

exports.handler = async (event) => {
  const generateContent = require('./generateContent');
  const postTweet = require('./postTweet');

  async function run() {
    try {
      const prompt = event.prompt || "Default prompt if none provided"; // Use event data or a default prompt
      const content = await generateContent(prompt);

      if (content) {
        await postTweet(content);
      }
    } catch (error) {
      console.error("Error in Lambda function:", error);
      // Handle the error appropriately
    }
  }

  await run(); // Ensure that run completes before the handler exits
};
