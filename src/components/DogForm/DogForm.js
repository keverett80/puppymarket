import React, { useState, useRef, useEffect } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { createDog } from '../../graphql/mutations';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Storage } from 'aws-amplify';
import ImageUploading from "react-images-uploading";
import dogs from '../../helpers/dogBreed';
import './DogForm.css'
import { v4 as uuidv4 } from 'uuid';
import { LoadScript, GoogleMap, StandaloneSearchBox } from '@react-google-maps/api';
import { Auth } from 'aws-amplify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDog } from '@fortawesome/free-solid-svg-icons';

const getCurrentUser = async () => {
    try {
        const user = await Auth.currentAuthenticatedUser();
        return user.attributes.email;  // This will return the email of the currently authenticated user.
    } catch (error) {
        console.error('Error fetching user', error);
        return null;
    }
};

const libraries = ["places"];
function DogForm({ handleAddDog }) {
  const initialState = {
    name: '',
    breed: '',
    birthDate: '', // Updated initial value
    price: '',
    imageUrls: [],
    description: '',
    dateListed: '', // New field
    gender: '', // New field with default value
    location: '',    // New field
    type: 'Dog'
};

const [dog, setDog] = useState(initialState);


const [inputValue, setInputValue] = useState(""); // to track what's being typed
const [location, setLocation] = useState(""); // for the final selected location
const [filteredBreeds, setFilteredBreeds] = useState(dogs);
const [isDropdownVisible, setIsDropdownVisible] = useState(false);
const [errors, setErrors] = useState({}); // New state for errors


    const searchBox = useRef();

    const handlePlaceSelect = () => {
      const place = searchBox.current.getPlaces()[0];
      let city, state;
      for (let i = 0; i < place.address_components.length; i++) {
          let addressType = place.address_components[i].types[0];
          if (addressType === "locality") {
              city = place.address_components[i].long_name;
          } else if (addressType === "administrative_area_level_1") {
              state = place.address_components[i].short_name;
          }
      }
      const selectedLocation = `${city}, ${state}`;
      setLocation(selectedLocation); // set the final location
      setInputValue(selectedLocation); // also update the input field

      setDog(prev => ({ ...prev, location: selectedLocation })); // Update the dog object with the new location
    };






    const maxNumber = 69;
    const handleImagesChange = (imageList) => {
      setDog(prev => ({ ...prev, imageUrls: imageList }));
  };


  const validateForm = () => {
    const newErrors = {};

    if (!dog.name.trim()) newErrors.name = "Name is required.";
    if (!dog.breed.trim()) newErrors.breed = "Breed is required.";
    if (!dog.birthDate.trim()) newErrors.birthDate = "Birth Date is required.";
    if (!dog.price.trim()) newErrors.price = "Rehome fee is required.";
    if (!dog.gender.trim()) newErrors.gender = "Gender is required.";
    if (!dog.location.trim()) newErrors.location = "Location is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
};

const handleSubmit = async (event) => {
  event.preventDefault();

  if (validateForm()) {
      dog.dateListed = new Date().toISOString();

      // Fetch current user's email and update the `verified` field.
      const userEmail = await getCurrentUser();
      if (userEmail) {
          dog.verified = userEmail;
      } else {
          console.warn('Could not get the user email. The `verified` field will not be updated.');
      }
    // Upload images to S3 and get the S3 keys
    const imageUrls = await Promise.all(dog.imageUrls.map(img => {
      const extension = img.file.name.split(".").pop();
      const uniqueFileName = `${uuidv4()}.${extension}`;
      const contentType = extension === 'jpg' ? 'image/jpeg' : 'image/png';


      return Storage.put(uniqueFileName, img.file, {
        contentType: contentType
    });


    }));
    const imageKeys = imageUrls.map(result => result.key);

    try {
      await API.graphql(graphqlOperation(createDog, { input: { ...dog, imageUrls: imageKeys }, authMode: 'AMAZON_COGNITO_USER_POOLS' }));

      if (handleAddDog) handleAddDog();
      setDog(initialState);  // Reset the form after submission
  } catch (error) {
      console.error("Error adding dog:", error);
  }
}
};




  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    try {
        const result = await Storage.put(file.name, file, {
            contentType: 'image/png',
            region: 'us-east-1'
        });
        setDog(prev => ({ ...prev, imageUrls: result.key }));
    } catch (error) {
        console.error("Error uploading file:", error);
    }
};

  const handleChange = async (event) => {
  const { name, value } = event.target;


  if (name === 'imageUrls') {
    const file = event.target.files[0];
    const fileName = `${Date.now()}-${file.name}`; // This gives each file a unique name based on timestamp
    const extension = file.name.split(".").pop();
const contentType = extension === 'jpg' ? 'image/jpeg' : 'image/png';


    try {
      const result = await Storage.put(fileName, file, {
        contentType: contentType
    });

      setDog(prev => ({ ...prev, imageUrls: result.key }));
    } catch (error) {
      console.error("Error uploading the file", error);
    }
  } else {
    setDog(prev => ({ ...prev, [name]: value }));
  }
};



  return (
    <div className="no-background">
<LoadScript googleMapsApiKey="AIzaSyAdnS_bTUUA8hlPRJkr0tDPBZ_vdA4hH9Y" libraries={libraries}>
      <Container className="no-background">
        <Row className="justify-content-center">
          <Col md={8}>
          <h2 className="text-center mb-4" style={{color: '#c7c7c7'}}>
  <FontAwesomeIcon icon={faDog} className="mr-2" />
  List your pup!
</h2>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                <Form.Group className="mb-6">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                    className="bold-border"
                      type="text"
                      name="name"
                      placeholder="Enter dog name"
                      value={dog.name}
                      onChange={handleChange}
                    />
                     {errors.name && <div className="text-danger">{errors.name}</div>}
                  </Form.Group>
                </Col>
                <Col md={6}>
                <Form.Group className="mb-3 position-relative">
    <Form.Label>Breed</Form.Label>
    <Form.Control
     className="bold-border"
    type="text"
    name="breed"
    placeholder="Enter dog breed"
    value={dog.breed}
    onFocus={() => setIsDropdownVisible(true)}
    onBlur={() => setTimeout(() => setIsDropdownVisible(false), 150)}
    onChange={(e) => {
        const userInput = e.target.value;
        setDog(prev => ({ ...prev, breed: userInput }));
        const filtered = dogs.filter(breed =>
            breed.toLowerCase().includes(userInput.toLowerCase())
        );
        setFilteredBreeds(filtered);
        setIsDropdownVisible(true);
    }}
/>

<div className="breed-dropdown">
    {isDropdownVisible && dog.breed && filteredBreeds.map((breed, index) => (
        <div
            key={index}
            className="breed-item"
            onClick={() => {
                setDog(prev => ({ ...prev, breed: breed }));
                setIsDropdownVisible(false);
            }}
        >
            {breed}
        </div>
    ))}
</div>
{errors.breed && <div className="text-danger">{errors.breed}</div>}
</Form.Group>


                </Col>

              </Row>



              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Rehoming fee</Form.Label>
                    <Form.Control
                     className="bold-border"
                      type="number"
                      name="Rehoming fee"
                      placeholder="Enter fee"
                      value={dog.price}
                      onChange={handleChange}
                    />
                     {errors.price && <div className="text-danger">{errors.price}</div>}
                  </Form.Group>
                </Col>
                <Col md={6}>
                <Form.Group className="mb-3">
                        <Form.Label>Birth Date</Form.Label>
                        <Form.Control
                         className="bold-border"
                         placeholder="Enter dog's birthday"
                            type="date"
                            name="birthDate"
                            value={dog.birthDate}
                            onChange={handleChange}
                        />
                         {errors.birthDate && <div className="text-danger">{errors.birthDate}</div>}
                    </Form.Group>
                </Col>

              </Row>
              <Row>
                <Col md={6}>
                <Form.Group className="mb-3">
                    <Form.Label>Location</Form.Label>
                    <StandaloneSearchBox
                        ref={searchBox}
                        onLoad={ref => searchBox.current = ref}
                        onPlacesChanged={handlePlaceSelect}

                    >
                                    <Form.Control
                                     className="bold-border"
                  type="text"
                  placeholder="Enter dog location"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}

                />

                    </StandaloneSearchBox>
                    {errors.location && <div className="text-danger">{errors.location}</div>}
                </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        <Form.Control
                         className="bold-border"
                            as="select"
                            name="gender"
                            value={dog.gender}
                            onChange={handleChange}

                        >
                          <option value="">Select dog gender</option>
                            <option value="MALE">Male</option>
                            <option value="FEMALE">Female</option>
                        </Form.Control>
                        {errors.gender && <div className="text-danger">{errors.gender}</div>}
                    </Form.Group>
                </Col>
            </Row>


              <Form.Group className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                 className="bold-border"
                  as="textarea"
                  name="description"
                  rows={3}
                  placeholder="Enter a short description about the dog"
                  value={dog.description}
                  onChange={handleChange}
                />
              </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Upload Images</Form.Label>
                    <ImageUploading
                        multiple
                        value={dog.imageUrls}
                        onChange={handleImagesChange}
                        maxNumber={maxNumber}
                        dataURLKey="data_url"
                        acceptType={["jpg", "png"]} // Added support for PNG too
                    >
                        {({
                            imageList,
                            onImageUpload,
                            onImageRemoveAll,
                            onImageUpdate,
                            onImageRemove,
                            isDragging,
                            dragProps
                        }) => (
                            <div className="upload__image-wrapper">
                                                      <Button className='m-2'
                              variant={isDragging ? "outline-danger" : "outline-secondary"}
                              onClick={onImageUpload}
                              {...dragProps}
                          >
                              Click or Drop here
                          </Button>

                                &nbsp;
                                <Button className='m-2' variant="outline-danger" onClick={onImageRemoveAll}>Remove all images</Button>
                                                            <div className="d-flex flex-row flex-wrap">
                                {imageList.map((image, index) => (
                                    <div key={index} className="p-2">
                                        <div className="image-item">
                                            <img src={image.data_url} alt="" width="100" />
         <div className="image-item__btn-wrapper">
  <Button
    variant="outline-secondary"
    className="btn-sm rounded-circle mx-2 my-2" // Added btn-sm and rounded-circle
    onClick={() => onImageUpdate(index)}
  >
    Update
  </Button>
  <Button
    variant="outline-danger"
    className="btn-sm rounded-circle mx-2 my-2" // Added btn-sm and rounded-circle
    onClick={() => onImageRemove(index)}
  >
    Remove
  </Button>
</div>


                                        </div>
                                    </div>
                                ))}
                            </div>

                            </div>
                        )}
                    </ImageUploading>
                </Form.Group>


                <Button variant="outline-primary" type="submit" className="m-2">
    Add Dog
</Button>
            </Form>
          </Col>
        </Row>
      </Container></LoadScript></div>
  );
}

export default DogForm;