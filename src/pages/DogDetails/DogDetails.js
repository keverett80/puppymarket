import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { API, Storage } from 'aws-amplify';  // <-- Added GRAPHQL_AUTH_MODE import
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import * as mutations from '../../graphql/mutations';
import { useNavigate } from 'react-router-dom';

import { getDog } from '../../graphql/queries';
import { Card, Button, Row, Col,Modal } from 'react-bootstrap';

import Form from 'react-bootstrap/Form';


import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVenus, faMars } from '@fortawesome/free-solid-svg-icons';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import { Auth } from 'aws-amplify';
import './DogDetails.css'

function DogDetails() {
  const navigate = useNavigate();
  const [dog, setDog] = useState(null);
  const [imageUrls, setImageUrls] = useState([]);
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [selectedImageUrl, setSelectedImageUrl] = useState(''); // State to track which image URL is selected to view in expanded mode
  const { id } = useParams();
  const [contactModalVisible, setContactModalVisible] = useState(false);
  const [contactDetails, setContactDetails] = useState({ name: '', phone: '', email: '', message: '' });
  const [userEmail, setUserEmail] = useState('');

useEffect(() => {
  const fetchUserEmail = async () => {
    try {
      const user = await Auth.currentAuthenticatedUser();
      setUserEmail(user.attributes.email);
    } catch (error) {
      console.error('Error fetching user email: ', error);
    }
  };

  fetchUserEmail();
}, []);
const deleteDogPost = async () => {
  try {
    // Delete images from S3
  /*  if (dog.imageUrls && Array.isArray(dog.imageUrls)) {
      for (const imageUrlKey of dog.imageUrls) {
        await Storage.remove(imageUrlKey);
      }
    } */

    // Delete the post from the database
    console.log(dog.id)
    const result = await API.graphql({
      query: mutations.deleteDog,
      variables: {
        input: { id: dog.id },

      },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
    });

    if (result.data.deleteDog) {
      alert('Dog post successfully deleted.');
      // Navigate to another page or refresh current page
      // For example:
      navigate('/home');

    } else {
      alert('Error deleting dog post.');
    }
  } catch (error) {
    console.error('Error deleting dog post:', error);
    alert('Error deleting dog post. Please try again later.');
  }
};


  const isFormValid = () => {
    if (!contactDetails.name || !contactDetails.email || !contactDetails.phone || !contactDetails.message) {
      return false;
    }
    if (!isValidEmail(contactDetails.email)) {
      alert("Please provide a valid email address.");
      return false;
    }
    if (!isValidPhoneNumber(contactDetails.phone)) {
      alert("Please provide a valid phone number in the format: (123) 456-7890 or 123-456-7890.");
      return false;
    }
    return true;
  };


  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone) => {
    // This regex assumes phone numbers in the format: (123) 456-7890 or 123-456-7890
    const phoneRegex = /^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/;
    return phoneRegex.test(phone);
  };


  const handleContactChange = (event) => {
    const { name, value } = event.target;

    let formattedValue = value;

    if (name === "phone") {
        formattedValue = value.replace(/\D/g, '');  // Remove all non-digit characters

        if (formattedValue.length > 3 && formattedValue.length <= 6) {
            formattedValue = `(${formattedValue.slice(0, 3)}) ${formattedValue.slice(3)}`;
        } else if (formattedValue.length > 6) {
            formattedValue = `(${formattedValue.slice(0, 3)}) ${formattedValue.slice(3, 6)}-${formattedValue.slice(6, 10)}`;
        }
    }

    setContactDetails(prevState => ({
        ...prevState,
        [name]: formattedValue
    }));
};


  const calculateAge = birthDateStr => {
    const birthDate = new Date(birthDateStr);
    const today = new Date();

    const diffInMs = today - birthDate;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

    if (diffInDays < 30) {
      return `${Math.floor(diffInDays)} day(s)`;
    }

    const diffInMonths = diffInDays / 30;
    if (diffInMonths < 12) {
      return `${Math.floor(diffInMonths)} month(s)`;
    }

    const diffInYears = diffInMonths / 12;
    return `${Math.floor(diffInYears)} year(s)`;
  };



  useEffect(() => {
    const fetchDog = async () => {
      try {

        const result = await API.graphql({
          query: getDog,
          variables: { id: id },
          authMode: GRAPHQL_AUTH_MODE.API_KEY // <-- Specify auth mode here
        });
        setDog(result.data.getDog);

        // Fetch the images from S3 and set the URLs to state
        if (result.data.getDog.imageUrls && Array.isArray(result.data.getDog.imageUrls)) {
          const urls = await Promise.all(
            result.data.getDog.imageUrls.map(async imageUrlKey => {
              if (imageUrlKey.includes('https://')) {
                const pathParts = new URL(imageUrlKey).pathname.split('/');
                imageUrlKey = pathParts.slice(2).join('/');
              }
              return await Storage.get(imageUrlKey);
            })
          );
          setImageUrls(urls);
        }
      } catch (error) {
        console.error("Error fetching dog details:", error);
      }
    };

    fetchDog();
  }, [id]);

  const handleImageClick = (url) => {
    setSelectedImageUrl(url);
    setShowModal(true);
  }
  const handleContactSubmit = async () => {
    if (!isFormValid()) {
      alert("All fields are required!");
      return;
    }
    const isConfirmed = window.confirm("Are you sure you want to send this message?");
    if (!isConfirmed) {
      return; // If user clicks "Cancel", it will stop the function here.
    }

    try {
      const payload = {
        name: contactDetails.name.toUpperCase(),
        phone: contactDetails.phone.toUpperCase(),
        email: contactDetails.email.toUpperCase(),
        message: contactDetails.message.toUpperCase(),
        targetEmail: dog.verified.toUpperCase(),

        dogBreed: dog.breed.toUpperCase(),
        dogName: dog.name.toUpperCase()
      };

      console.log("Payload being sent:", payload);
      setContactModalVisible(false);
      setContactDetails({ email: '', message: '', name: '', phone: '' });


      const response = await fetch('https://yt7xbf4l00.execute-api.us-east-1.amazonaws.com/default/puppyMarketPlace', {
        method: 'POST',
        mode: 'no-cors',
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

    } catch (error) {
      console.error("Error sending email:", error.message);
    }



  };



  if (!dog) return <div>Loading...</div>;

  return (
    <>
<Modal show={contactModalVisible} onHide={() => setContactModalVisible(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Contact Owner</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <Form>
    <Form.Group className="mb-3">
  <Form.Label>Name</Form.Label>
  <Form.Control
    type="text"
    name="name"
    value={contactDetails.name}
    onChange={handleContactChange}
    placeholder="Your name"
  />
</Form.Group>
<Form.Group className="mb-3">
  <Form.Label>Phone Number</Form.Label>
  <Form.Control
    type="tel"
    name="phone"
    value={contactDetails.phone}
    onChange={handleContactChange}
    placeholder="Your phone number"
  />
</Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email Address</Form.Label>
        <Form.Control
          type="email"
          name="email"
          value={contactDetails.email}
          onChange={handleContactChange}
          placeholder="Your email address"
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Message</Form.Label>
        <Form.Control
          as="textarea"
          name="message"
          value={contactDetails.message}
          onChange={handleContactChange}
          placeholder="Your message"
        />
      </Form.Group>
    </Form>
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setContactModalVisible(false)}>
      Close
    </Button>
    <Button variant="primary" onClick={handleContactSubmit} type='button'>
      Send
    </Button>
  </Modal.Footer>
</Modal>

    <div className="container mt-4">
       <Card className="wider-card">

<Card.Header className="dog-info-section">
      <Row>
      <Col className="gender-col">
  {dog.gender === 'Male' ? (
    <FontAwesomeIcon icon={faMars} className="mr-2 blue-icon" /> // Male icon with blue color
  ) : (
    <FontAwesomeIcon icon={faVenus} className="mr-2 pink-icon" /> // Female icon with pink color
  )}{" "}
  {dog.gender}
</Col>
<Col className="centered-content">
      <Card.Title className="dog-name">
        <strong className="breed-label"><FontAwesomeIcon icon={faPaw} className="mr-2" /> Breed:</strong> {dog.breed}
      </Card.Title>
    </Col>



      </Row>
    </Card.Header>



    <Card.Body className="dog-info-section">
  <div className="dog-info-section">
    <Row className="dog-card">

      <Col md={{ span: 7, order: 1 }}>

        <Card.Text className="dog-info">
          <div className="dog-info-item">
            <span className="info-label">Nickname:</span> <strong>{dog.name}</strong>
          </div>
          <div className="dog-info-item">
            <span className="info-label">Rehoming fee:</span> <strong>${dog.price}</strong>
          </div>
          <div className="dog-info-item">
          <span className="info-label">Age:</span>
  <strong>{calculateAge(dog.birthDate)}</strong>
          </div>
          <div className="dog-info-item">
            <span className="info-label1">Location:</span> <strong>{dog.location}</strong>
          </div>
          <div className="dog-info-item1">
            <span className="info-label1">Description:</span> <strong><em>{dog.description}</em></strong>
          </div>

        </Card.Text>
      </Col>

    </Row>
  </div>
</Card.Body>




<Card.Footer className="dog-info-section">

  {imageUrls.map((url, index) => (
                <img
                  src={url}
                  alt={dog.name}
                  className="img-fluid dog-thumbnail mb-2" // Use class for styling
                  key={index}
                  onClick={() => handleImageClick(url)}
                />
              ))}
                     <div className="dog-info-item">
           <span className="info-label"> Date Listed:</span> <strong>
    {new Date(dog.dateListed).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })}
  </strong>
</div>
{userEmail !== dog.verified && (<Button onClick={() => {
  if (dog.verified) {
    setContactModalVisible(true);
  } else {
    alert("The owner's email is not verified. You can't contact them at the moment.");
  }
}}>Contact</Button>)}

{userEmail === dog.verified && (
  <Button variant="danger" onClick={deleteDogPost} className="my-3">
   Remove Listing
  </Button>
)}

</Card.Footer>


    </Card>


              <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Body>
                  <img src={selectedImageUrl} alt={dog.name} className="img-fluid" />
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
                </Modal.Footer>
              </Modal>
            </div></>

  );
}

export default DogDetails;
