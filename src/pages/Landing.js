// CustomJumbotron.js
import React from 'react';
import { Button } from 'react-bootstrap';

function CustomJumbotron({ isAuthenticated, handleLogin }) {
  if (isAuthenticated) return null;

  return (
    <div className="p-5 m-3 text-center bg-transparent">
      <h1 className="display-4 text-primary font-weight-bold">Discover Puppies For Sale!</h1>
      <div className="lead">
        Dive into a world of adorable puppies ready for a new home. Whether you're looking to find your next companion or place an ad for your puppy, we've got you covered.
      </div>
      <hr className="my-4" />

    </div>
  );
}

export default CustomJumbotron;
