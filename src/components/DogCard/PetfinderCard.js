import React from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVenus, faMars, faPaw } from '@fortawesome/free-solid-svg-icons';
import './DogCard.css';

const PetfinderCard = ({ animal }) => {
  if (!animal) return null;

  // Construct the URL for the image
  const imageUrl = animal.photos?.[0]?.large || 'path_to_default_image_or_empty';

  return (
    <Card className="wider-card">
      <Card.Header className="dog-info-section">
        <Row>
          <Col className="gender-col">
            {animal.gender === 'Male' ? (
              <FontAwesomeIcon icon={faMars} className="mr-2 blue-icon" />
            ) : (
              <FontAwesomeIcon icon={faVenus} className="mr-2 pink-icon" />
            )}{" "}
            {animal.gender}
          </Col>
          <Col className="centered-content">
            <Card.Title className="dog-name">
              <strong className="breed-label">
                <FontAwesomeIcon icon={faPaw} className="mr-2" /> Breed:{" "}
              </strong>{" "}
              {animal.breeds.primary}
            </Card.Title>
          </Col>
        </Row>
      </Card.Header>

      <Card.Body className="dog-info-section">
        <div className="dog-info-section">
          <Row className="dog-card">
            <Col md={{ span: 5, order: 2 }}>
              <Card.Img src={imageUrl} className="dog-image" alt={animal.name} />
            </Col>
            <Col md={{ span: 7, order: 1 }}>
              <Card.Text className="dog-info">
                <div className="dog-info-item">
                  <span className="info-label">Name:</span> <strong>{animal.name}</strong>
                </div>
                <div className="dog-info-item">
                  <span className="info-label">Age:</span> <strong>{animal.age}</strong>
                </div>
                <div className="dog-info-item">
                <span className="info-label">Location:</span> <strong>{animal.contact.address.city && animal.contact.address.state ? `${animal.contact.address.city}, ${animal.contact.address.state}` : 'Location not available'}</strong>
                </div>
              </Card.Text>
              <div className="d-flex justify-content-left">
                <a href={animal.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" className="rounded-circle">
                    View More
                  </Button>
                </a>
              </div>
            </Col>
          </Row>
        </div>
      </Card.Body>

      <Card.Footer className="dog-info-section">
        {/* Additional Footer Content if needed */}
      </Card.Footer>
    </Card>
  );
};

export default PetfinderCard;
