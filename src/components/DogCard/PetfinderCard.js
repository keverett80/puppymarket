// PetfinderCard.js (Fully aligned with MUI layout)
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid,
  Box,
  Button
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMars, faVenus } from '@fortawesome/free-solid-svg-icons';

const PetfinderCard = ({ animal }) => {
  if (!animal) return null;

  const imageUrl = animal.photos?.[0]?.large || '/no-dogs-placeholder.png';
  const genderIcon = animal.gender === 'Male' ? faMars : faVenus;
  const genderColor = animal.gender === 'Male' ? '#007bff' : '#e83e8c';

  return (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
>

      <CardMedia
        component="img"
        image={imageUrl}
        alt={animal.name}
        sx={{
          height: 200,
          width: '100%',
          objectFit: 'cover',
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8
        }}
      />

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Grid container justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" fontWeight="bold">
            {animal.name}
          </Typography>
          <FontAwesomeIcon icon={genderIcon} color={genderColor} />
        </Grid>

        <Typography variant="body2" color="text.secondary" gutterBottom>
          {animal.breeds?.primary || 'Breed Unknown'} • {animal.age}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {animal.contact?.address?.city && animal.contact?.address?.state
            ? `${animal.contact.address.city}, ${animal.contact.address.state}`
            : 'Location not available'}
        </Typography>
      </CardContent>

      <Box textAlign="center" pb={2} mt="auto">
        <Button
          variant="outlined"
          size="small"
          href={animal.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          View More
        </Button>
      </Box>
    </Card>
  );
};

export default PetfinderCard;
