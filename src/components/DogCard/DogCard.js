import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid,
  Box,
  Button,
  Chip
} from '@mui/material';
import { Storage } from 'aws-amplify';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrash } from '@fortawesome/free-solid-svg-icons';

const DogCard = ({ dog, showManage = false, onEdit, onDelete }) => {
  const [imageUrl, setImageUrl] = useState('/fallback-dog.png');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadImage = async () => {
      const key = Array.isArray(dog?.imageUrls) && dog.imageUrls.length > 0
        ? dog.imageUrls[0]
        : null;

      if (!key) {
        setLoading(false);
        return;
      }

      try {
        const url = await Storage.get(key, { level: 'public' });

        const img = new Image();
        img.onload = () => {
          setImageUrl(url);
          setLoading(false);
        };
        img.onerror = () => {
          console.warn("Image exists in S3 but failed to load:", url);
          setImageUrl('/fallback-dog.png');
          setLoading(false);
        };
        img.src = url;
      } catch (err) {
        console.warn('Storage.get() failed:', err);
        setImageUrl('/fallback-dog.png');
        setLoading(false);
      }
    };

    loadImage();
  }, [dog?.imageUrls]);

  if (!dog) return null;

  return (

      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}
>

      <Link to={`/dogs/${dog.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {loading ? (
          <Box sx={{
            height: 200,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#f5f5f5'
          }}>
            <Typography color="text.secondary">Loading...</Typography>
          </Box>
        ) : (
          <CardMedia
            component="img"
            image={imageUrl}
            alt={dog.name}
            sx={{
              height: 200,
              width: '100%',
              objectFit: 'cover',
              borderTopLeftRadius: 8,
              borderTopRightRadius: 8
            }}
          />
        )}
      </Link>

      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" noWrap>
          {dog.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Breed: {dog.breed || '—'}<br />
          Price: {dog.price ? `$${dog.price}` : '—'}<br />
          Location: {dog.location || '—'}
        </Typography>

        <Box mt={2} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            {dog.gender && <Chip size="small" label={dog.gender} color="info" sx={{ mr: 1 }} />}
            {dog.dateListed && (
              <Chip
                size="small"
                label={new Date(dog.dateListed).toLocaleDateString()}
                color="default"
              />
            )}
          </Box>

          {showManage && (
            <Box display="flex" gap={1}>
              <Button
                size="small"
                color="warning"
                variant="contained"
                onClick={() => onEdit?.(dog)}
              >
                <FontAwesomeIcon icon={faPen} />
              </Button>
              <Button
                size="small"
                color="error"
                variant="contained"
                onClick={() => onDelete?.(dog)}
              >
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Box>
          )}
        </Box>
      </CardContent>
           <Box textAlign="center" pb={2} mt="auto">
              <Button
                variant="outlined"
                size="small"
                href={`/dogs/${dog.id}`}

                rel="noopener noreferrer"
              >
                View More
              </Button>
            </Box>
    </Card>
  );
};

export default DogCard;
