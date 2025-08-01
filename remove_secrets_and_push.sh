#!/bin/bash

echo "🚨 Starting Git history cleanup for exposed secrets..."

# Remove sensitive files from all history
git filter-repo --force \
  --path .env \
  --path src/aws-exports.js \
  --path index.js \
  --invert-paths

echo "✅ Filter-repo complete. Force pushing cleaned history..."

# Force push to remote
git push --force --all

echo "✅ Secrets removed from history and pushed."
echo "🛡 Remember to:"
echo "1. Revoke all exposed API keys (Twitter, OpenAI, AWS)"
echo "2. Replace secrets using environment variables"
echo "3. Commit .env.example instead of real .env"
