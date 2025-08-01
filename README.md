# 🐾 Puppy Marketplace – React + AWS Amplify

A full-featured, mobile-friendly platform for listing and adopting pets. Built with React, AWS Amplify, and GraphQL, it allows users to create pet listings, authenticate securely, and share their listings on social media.

## 🚀 Features

- 🔐 **Authentication** – AWS Amplify Auth for user login/signup
- 📸 **Pet Listings** – Upload pet profiles and photos
- 📝 **GraphQL API** – AWS AppSync integration for queries and mutations
- 💬 **Chat Page & Contact Form** – For support or matching questions
- 📱 **Mobile-Ready** – Responsive UI with a clean modern layout
- 🤖 **Instagram OAuth Support** – For social login workflows
- 💡 **Custom Components** – Including modals, carousels, and user profiles

## 📁 Project Structure

```
src/
├── assets/                # Images and branding
├── components/            # Reusable UI elements (NavBar, Footer, etc.)
├── graphql/               # Amplify-generated queries/mutations
├── helpers/               # Utility functions
├── pages/                 # Application routes/views
├── App.js / index.js      # App bootstrap
```

## 🛠️ Getting Started

Install dependencies:
```bash
npm install
```

Run the development server:
```bash
npm start
```

## 🔒 Security

Be sure to keep the following files out of version control (see `.gitignore`):
- `aws-exports.js`
- `.env.*`
- `amplifyconfiguration.json`

## 📸 Screenshots



## 📜 License

MIT License – feel free to fork, contribute, or use with attribution.
