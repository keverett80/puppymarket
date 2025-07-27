import React, { useState } from 'react';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // ⬅️ Add this

export default function ContactSupport() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const navigate = useNavigate(); // ⬅️ Add this

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.phone || !form.message) {
      alert("All fields are required.");
      return;
    }

    const payload = {
      name: form.name.toUpperCase(),
      email: form.email.toUpperCase(),
      phone: form.phone.toUpperCase(),
      message: form.message.toUpperCase(),
      targetEmail: "contact@littlepawsplace.com",
      dogBreed: "N/A",
      dogName: "N/A"
    };

    try {
      await fetch('https://yt7xbf4l00.execute-api.us-east-1.amazonaws.com/default/puppyMarketPlace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });

      alert("Thanks for contacting us! We'll get back to you shortly.");
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error("Contact error:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Contact the LittlePawsPlace Team</Typography>

        {/* 🟦 Back Button */}
        <Button variant="text" color="primary" onClick={() => navigate(-1)} sx={{ mb: 2 }}>
          ← Back
        </Button>

        <TextField label="Name" name="name" fullWidth margin="normal" value={form.name} onChange={handleChange} />
        <TextField label="Email" name="email" fullWidth margin="normal" value={form.email} onChange={handleChange} />
        <TextField label="Phone" name="phone" fullWidth margin="normal" value={form.phone} onChange={handleChange} />
        <TextField label="Message" name="message" fullWidth multiline rows={4} margin="normal" value={form.message} onChange={handleChange} />
        <Button variant="contained" onClick={handleSubmit}>Send Message</Button>
      </Box>
    </Container>
  );
}
