import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import { Amplify } from 'aws-amplify'
import config from './aws-exports';
import 'bootstrap/dist/css/bootstrap.min.css';

Amplify.configure({
  ...config,
  Storage: {
      ...config.Storage,
      region: 'us-east-1'  // replace 'us-west-2' with your actual region
  }
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />

  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
