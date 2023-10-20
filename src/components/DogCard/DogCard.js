import React from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVenus, faMars } from '@fortawesome/free-solid-svg-icons';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import './DogCard.css'

const DogCard = ({ dog, age }) => {
  // Construct the full URL for the image
  const imageUrl = `https://puppymarketplaces155206-dev.s3.amazonaws.com/public/${dog.imageUrls[0]}`;

  return (
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
        <strong className="breed-label"><FontAwesomeIcon icon={faPaw} className="mr-2" /> Breed: </strong> {dog.breed}
      </Card.Title>
    </Col>


      </Row>
    </Card.Header>



    <Card.Body className="dog-info-section">
  <div className="dog-info-section">
    <Row className="dog-card">
      <Col md={{ span: 5, order: 2 }}>
        <Card.Img
          src={imageUrl}
          className="dog-image"
          alt={dog.name}
        />
      </Col>
      <Col md={{ span: 7, order: 1 }}>

        <Card.Text className="dog-info">
          <div className="dog-info-item">
            <span className="info-label">Nickname:</span> <strong>{dog.name}</strong>
          </div>
          <div className="dog-info-item">
            <span className="info-label">Price:</span> <strong>${dog.price}</strong>
          </div>
          <div className="dog-info-item">
            <span className="info-label">Age:</span> <strong>{age}</strong>
          </div>
          <div className="dog-info-item">
            <span className="info-label">Location:</span> <strong>{dog.location}</strong>
          </div>
        </Card.Text>
        <div className="d-flex justify-content-left">
    <NavLink to={`/dogs/${dog.id}`}>
    <Button variant="primary" className="rounded-circle">
  View More
</Button>
    </NavLink>
  </div>
      </Col>
    </Row>
  </div>
</Card.Body>




<Card.Footer className="dog-info-section">
  <em>{dog.description}</em>

  <div className="d-flex justify-content-end">
    Date Listed:&nbsp;<strong>
      {new Date(dog.dateListed).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })}
    </strong>
  </div>
</Card.Footer>



    </Card>
  );
}

export default DogCard;
