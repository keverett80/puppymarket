import React from 'react';
import { Card, Button } from 'react-bootstrap';

const DogCard = ({ dog }) => {
  return (
    <Card style={{ width: '18rem', marginBottom: '1rem' }}>
      <Card.Img variant="top" src={dog.imageUrl} />
      <Card.Body>
        <Card.Title>{dog.name}</Card.Title>
        <Card.Text>
          Breed: {dog.breed}
          <br />
          Price: ${dog.price}
          <br />
          {dog.description}
        </Card.Text>
        <Button variant="primary">See Details</Button>
      </Card.Body>
    </Card>
  );
}

export default DogCard;
