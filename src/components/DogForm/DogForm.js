import React, { useState, useRef, useEffect } from 'react';
import { API, graphqlOperation, Storage, Auth } from 'aws-amplify';
import { createDog } from '../../graphql/mutations';
import { v4 as uuidv4 } from 'uuid';
import dogs from '../../helpers/dogBreed';
import ImageUploading from "react-images-uploading";
import { useJsApiLoader, StandaloneSearchBox } from '@react-google-maps/api';

import {
  Stepper, Step, StepLabel, Button, TextField, MenuItem, Box, Typography, Container
} from '@mui/material';
import loadingGif from '../../assets/images/loading.gif';

import { useNavigate } from 'react-router-dom'; // make sure this is at the top









const libraries = ["places"];

const initialState = {
  name: '',
  breed: '',
  birthDate: '',
  price: '',
  gender: '',
  description: '',
  imageUrls: [],
  location: '',
  type: 'Dog',
  dateListed: '',
};

const getCurrentUser = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    return user.attributes.email;
  } catch (err) {
    console.error("Error fetching user", err);
    return null;
  }
};

const steps = ["Basic Info", "Photos & Description", "Location"];

export default function DogFormStepper() {
  const { isLoaded } = useJsApiLoader({
  googleMapsApiKey: "AIzaSyAdnS_bTUUA8hlPRJkr0tDPBZ_vdA4hH9Y",
  libraries: ['places'],
});

    const [username, setUsername] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await Auth.currentAuthenticatedUser();
        setUsername(user.username);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser();
  }, []);
  const [step, setStep] = useState(0);
  const [dog, setDog] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [inputValue, setInputValue] = useState("");
  const searchBox = useRef();
const [isSubmitting, setIsSubmitting] = useState(false);
const navigate = useNavigate();
const [imageError, setImageError] = useState('');

const handlePlaceSelect = () => {
  const places = searchBox.current?.getPlaces();
  if (!places || places.length === 0) {
    setErrors(prev => ({ ...prev, location: "Please select a valid U.S. city." }));
    return;
  }

  const place = places[0];
  const components = place.address_components || [];

  const city = components.find(c => c.types.includes("locality"))?.long_name;
  const state = components.find(c => c.types.includes("administrative_area_level_1"))?.short_name;

  if (!city || !state) {
    setErrors(prev => ({ ...prev, location: "Please choose a valid U.S. location (city + state)." }));
    return;
  }

 setDog(prev => ({
  ...prev,
  location: city,
  state: state.toUpperCase(),  // ✅ normalize casing
}));


  setInputValue(`${city}, ${state}`);
  setErrors(prev => ({ ...prev, location: "" }));
};



  const handleChange = (e) => {
    const { name, value } = e.target;
    setDog(prev => ({ ...prev, [name]: value }));
  };

const handleImagesChange = (imageList) => {
  if (imageList.length > 5) {
    setImageError('You can upload up to 5 images only.');
    return;
  }

  setImageError('');
  setDog(prev => ({
    ...prev,
    imageUrls: imageList.map(img => ({
      file: img.file,
      data_url: img.data_url
    }))
  }));
};



const validateStep = () => {
  const newErrors = {};

  if (step === 0) {
    if (!dog.name.trim()) newErrors.name = "Name is required.";
    if (!dog.breed.trim()) newErrors.breed = "Breed is required.";
    if (!dog.birthDate) newErrors.birthDate = "Birth date is required.";
    if (!dog.price || isNaN(Number(dog.price)) ) {
      newErrors.price = "Enter a valid rehoming fee.";
    }
    if (!dog.gender) newErrors.gender = "Gender is required.";
  }

  if (step === 1) {
    if (!dog.description.trim()) newErrors.description = "Description is required.";
    if (!dog.imageUrls || dog.imageUrls.length === 0) {
      newErrors.imageUrls = "At least one image is required.";
    }
  }

  if (step === 2) {
    if (!dog.location || !inputValue.trim()) newErrors.location = "Location is required.";
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};



  const next = () => {
    if (validateStep()) setStep(prev => prev + 1);
  };

  const back = () => setStep(prev => prev - 1);

const handleSubmit = async () => {
  if (!validateStep()) return;

  setIsSubmitting(true);
  try {
    const userEmail = await getCurrentUser();
    const dateListed = new Date().toISOString();

const imageUrls = await Promise.all(
  dog.imageUrls.map(async (img) => {
    const ext = img.file.name.split('.').pop();
    const fileName = `${uuidv4()}.${ext}`;
    const result = await Storage.put(fileName, img.file, {
      contentType: img.file.type,
      level: 'public',
    });
    return `https://${process.env.REACT_APP_S3_BUCKET}.s3.amazonaws.com/public/${result.key}`;
  })
);


  await API.graphql(
  graphqlOperation(createDog, {
    input: {
      ...dog,
      owner: username,        // ✅ required for ownership
      verified: userEmail,    // optional, if you're verifying by email separately
      dateListed,
      imageUrls,
    },
  })
);

    setDog(initialState);
    setStep(0);
    alert('Pet listed successfully!');
    navigate('/profile');
  } catch (error) {
    console.error('Submission error:', error);
    alert('Something went wrong. Please try again.');
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <Container maxWidth="sm">
      <Box sx={{ width: '100%', mt: 4 }}>
        <Stepper activeStep={step} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}><StepLabel>{label}</StepLabel></Step>
          ))}
        </Stepper>

        <Box sx={{ mt: 4 }}>
          {step === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Name" name="name" value={dog.name} onChange={handleChange} error={!!errors.name} helperText={errors.name} fullWidth />
              <TextField label="Breed/Type" name="breed" value={dog.breed} onChange={handleChange} error={!!errors.breed} helperText={errors.breed} fullWidth />
<TextField
  type="date"
  label="Birth Date"
  name="birthDate"
  value={dog.birthDate}
  onChange={handleChange}
  error={!!errors.birthDate}
  helperText={errors.birthDate}
  fullWidth
  InputLabelProps={{ shrink: true }}
 inputProps={{
    max: new Date().toISOString().split('T')[0],
    pattern: "\\d{4}-\\d{2}-\\d{2}"
 }}
  // force the input's root and the native <input> to match MUI's default height
 sx={{
    '& .MuiInputBase-root': {
      height: 56,                 // match other TextFields
    },
    '& .MuiInputBase-input': {
      height: '100%',             // fill the 56px container
      padding: '0 14px',          // same horizontal padding
      boxSizing: 'border-box',
    },
  }}

/>


              <TextField type="number" label="Rehoming Fee" name="price" value={dog.price} onChange={handleChange} error={!!errors.price} helperText={errors.price} fullWidth />
              <TextField select label="Gender" name="gender" value={dog.gender} onChange={handleChange} error={!!errors.gender} helperText={errors.gender} fullWidth>
                <MenuItem value="">Select</MenuItem>
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
              </TextField>
            </Box>
          )}

          {step === 1 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField label="Description" name="description" value={dog.description} onChange={handleChange} multiline rows={4} fullWidth />

            <ImageUploading
  multiple
  value={dog.imageUrls}
  onChange={handleImagesChange}
  maxNumber={5}
  dataURLKey="data_url"
  acceptType={["jpg", "jpeg", "png", "heic", "webp"]}
  onError={({ maxNumber }) => {
    if (maxNumber) {
      setImageError('You can upload a maximum of 5 images.');
    }
  }}
>
  {({ imageList, onImageUpload, onImageRemove }) => (
    <Box>
      <Button onClick={onImageUpload} variant="outlined">
        Upload Images ({imageList.length}/5)
      </Button>

      {imageError && (
        <Typography color="error" variant="body2" sx={{ mt: 1 }}>
          {imageError}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
        {imageList.map((img, idx) => (
          <Box key={idx} sx={{ position: 'relative' }}>
            <img
              src={img.data_url}
              alt="dog"
              width={100}
              height={100}
              style={{ objectFit: 'cover', borderRadius: 8 }}
            />
            <Button onClick={() => onImageRemove(idx)} size="small">
              Remove
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  )}
</ImageUploading>

              {imageError && (
  <Typography color="error" variant="body2" sx={{ mt: 1 }}>
    {imageError}
  </Typography>
)}
            </Box>
          )}

   {step === 2 && (
  isLoaded ? (
    <StandaloneSearchBox
      ref={searchBox}
      onLoad={(ref) => (searchBox.current = ref)}
      onPlacesChanged={handlePlaceSelect}
      options={{ componentRestrictions: { country: 'us' } }}
    >
      <TextField
        label="Location"
        name="location"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        error={!!errors.location}
        helperText={errors.location}
        fullWidth
      />
    </StandaloneSearchBox>
  ) : (
    <div>Loading Google Maps…</div>
  )
)}



          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            {step > 0 && (
  <Button onClick={back} disabled={isSubmitting}>Back</Button>
)}
{step < steps.length - 1 && (
  <Button onClick={next} disabled={isSubmitting}>Next</Button>
)}
{step === steps.length - 1 && (
  <Button variant="contained" onClick={handleSubmit} disabled={isSubmitting}>
    {isSubmitting ? 'Submitting...' : 'Submit'}
  </Button>
)}



          </Box>
                      {isSubmitting && (
  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
    <img src={loadingGif} alt="Submitting..." width={220} />
  </Box>
)}
        </Box>
      </Box>
    </Container>
  );
}