// components/DonationBanner.js
import React from 'react';
import { Alert, Button } from 'react-bootstrap';

const DonationBanner = () => {
  return (
    <Alert variant="warning" className="text-center">
      <h5 className="mb-2">🐾 Help Us Save More Lives</h5>
      <p className="mb-3">Your donation helps animals find safe, loving homes. Every bit counts!</p>
      <div className="d-flex justify-content-center gap-3">
        <Button
          variant="danger"
          href="https://www.paypal.com/donate/?hosted_button_id=TVRSFUFEUX9LJ"
          target="_blank"
          rel="noopener noreferrer"
        >
          Donate via PayPal
        </Button>  <Button
      variant="success"
      href="https://cash.app/$LittlePawsPlace"
      target="_blank"
      rel="noopener noreferrer"
    >
      Donate via Cash App
    </Button>
        <Button
          variant="outline-primary"
          href="https://www.buymeacoffee.com/littlepawsplace"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy Me a Coffee ☕
        </Button>
      </div>
    </Alert>
  );
};

export default DonationBanner;
