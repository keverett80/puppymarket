import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import { API,  Auth } from 'aws-amplify';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import { getDog } from '../../graphql/queries';
import { deleteDog } from '../../graphql/mutations';

function DogDetailsMui() {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [dog, setDog] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [contactDialogOpen, setContactDialogOpen] = useState(false);
  const [contact, setContact] = useState({ name: '', phone: '', email: '', message: '' });
const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidPhone = (phone) =>
  /^(\()?\d{3}(\))?[-.\s]?\d{3}[-.\s]?\d{4}$/.test(phone);

  useEffect(() => {
    const fetchDog = async () => {
      try {
        const { data } = await API.graphql({
          query: getDog,
          variables: { id },
          authMode: GRAPHQL_AUTH_MODE.API_KEY
        });
        setDog(data.getDog);

      setImageUrls(data.getDog.imageUrls || []);

      } catch (error) {
        console.error('Error fetching dog:', error);
      }
    };

    const fetchEmail = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUserEmail(user.attributes.email);
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    };

    fetchDog();
    fetchEmail();
  }, [id]);

  const calculateAge = date => {
    const diff = Date.now() - new Date(date).getTime();
    const age = new Date(diff);
    const years = age.getUTCFullYear() - 1970;
    const months = age.getUTCMonth();
    return years > 0 ? `${years} year(s)` : `${months} month(s)`;
  };

  const handleDelete = async () => {
    try {
      await API.graphql({
        query: deleteDog,
        variables: { input: { id: dog.id } },
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
      });
      navigate('/profile');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (!dog) return <Typography>Loading...</Typography>;

  return (
    <Box p={isMobile ? 2 : 4}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" gutterBottom>
            {dog.name} ({dog.breed})
          </Typography>
          <Typography variant="body1" mb={1}><strong>Age:</strong> {calculateAge(dog.birthDate)}</Typography>
          <Typography variant="body1" mb={1}><strong>Price:</strong> ${dog.price}</Typography>
          <Typography variant="body1" mb={1}><strong>Location:</strong> {dog.location}, {dog.state}</Typography>
          <Typography variant="body1" mb={2}><strong>Description:</strong> {dog.description}</Typography>
          <Chip label={dog.gender} color={dog.gender === 'MALE' ? 'primary' : 'secondary'} />
          <Divider sx={{ my: 2 }} />
          {userEmail !== dog.verified && (
            <Button variant="contained" onClick={() => setContactDialogOpen(true)} sx={{ mr: 2 }}>
              Contact Owner
            </Button>
          )}
          {userEmail === dog.verified && (
            <Button variant="outlined" color="error" onClick={handleDelete}>Delete Listing</Button>
          )}
          <Button onClick={() => navigate(-1)} sx={{ ml: 2 }}>Back</Button>
        </Grid>

     <Grid item xs={12} md={4}>
  <Grid container spacing={1}>
    {imageUrls.map((url, idx) => (
      // 2 columns on xs, 3 on sm, 4 on md+
      <Grid item xs={12} sm={6} md={4} key={idx}>
    <Card
  sx={{
    width: '100%',
    aspectRatio: '1 / 1',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer'
  }}
  onClick={() => setSelectedImage(url)}
>
  <CardMedia
    component="img"
    image={url}
    alt={`Dog ${idx}`}
    sx={{
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }}
  />
</Card>

      </Grid>
    ))}
  </Grid>
</Grid>
      </Grid>

      <Dialog open={!!selectedImage} onClose={() => setSelectedImage(null)} maxWidth="md">
        <DialogContent>
          <img src={selectedImage} alt="Preview" style={{ width: '100%' }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedImage(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)}>
        <DialogTitle>Contact Owner</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            margin="dense"
            value={contact.name}
            onChange={e => setContact(prev => ({ ...prev, name: e.target.value }))}
          />
          <TextField
            label="Phone"
            fullWidth
            margin="dense"
            value={contact.phone}
            onChange={e => setContact(prev => ({ ...prev, phone: e.target.value }))}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="dense"
            value={contact.email}
            onChange={e => setContact(prev => ({ ...prev, email: e.target.value }))}
          />
          <TextField
            label="Message"
            fullWidth
            margin="dense"
            multiline
            rows={4}
            value={contact.message}
            onChange={e => setContact(prev => ({ ...prev, message: e.target.value }))}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setContactDialogOpen(false)}>Cancel</Button>
         <Button
  variant="contained"
  onClick={async () => {
    // Validate fields
    if (!contact.name || !contact.phone || !contact.email || !contact.message) {
      alert("All fields are required.");
      return;
    }

    if (!isValidEmail(contact.email)) {
      alert("Please enter a valid email.");
      return;
    }

    if (!isValidPhone(contact.phone)) {
      alert("Please enter a valid phone number (e.g., 123-456-7890).");
      return;
    }

    const payload = {
      name: contact.name.toUpperCase(),
      phone: contact.phone.toUpperCase(),
      email: contact.email.toUpperCase(),
      message: contact.message.toUpperCase(),
      targetEmail: dog.verified?.toUpperCase(),
      dogBreed: dog.breed.toUpperCase(),
      dogName: dog.name.toUpperCase()
    };

    try {
      await fetch('https://yt7xbf4l00.execute-api.us-east-1.amazonaws.com/default/puppyMarketPlace', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        mode: 'no-cors',
        body: JSON.stringify(payload)
      });

      alert("Your message was sent!");
      setContactDialogOpen(false);
      setContact({ name: '', phone: '', email: '', message: '' });
    } catch (error) {
      console.error("Error sending contact message:", error);
      alert("Something went wrong. Please try again.");
    }
  }}
>
  Send
</Button>

        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default DogDetailsMui;
