import React from 'react';
import { Card, Button, Typography, Box } from '@mui/material';


const DonationCard = () => {
  return (
    <Card sx={{ p: 3, textAlign: 'center', backgroundColor: '#fff7f8', borderRadius: 4, boxShadow: 3 }}>

      <Typography variant="h6" gutterBottom>
        Help Us Save More Lives
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Your donation helps feed, shelter, and care for rescue animals in need. Every dollar counts.
      </Typography>

      <Box display="flex" flexDirection="column" gap={1}>
        <Button
          variant="contained"
          color="error"
          fullWidth
          href="https://www.paypal.com/donate?hosted_button_id=YOUR_BUTTON_ID"
          target="_blank"
          rel="noopener noreferrer"
        >
          Donate with PayPal
        </Button>

        <Button
          variant="outlined"
          color="error"
          fullWidth
          href="https://www.buymeacoffee.com/yourname"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy Us a Coffee ☕
        </Button>
      </Box>
    </Card>
  );
};

export default DonationCard;
