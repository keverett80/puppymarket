import React, { useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { createDog } from '../../graphql/mutations';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';

function DogForm({ handleAddDog }) {
  const [dog, setDog] = useState({
    name: '',
    breed: '',
    age: '1',
    price: '',
    imageUrl: '',
    description: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDog(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await API.graphql(graphqlOperation(createDog, { input: dog }));
      if (handleAddDog) handleAddDog();
    } catch (error) {
      console.error("Error adding dog:", error);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="text-center mb-4">Add a Dog</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter dog name"
                value={dog.name}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Breed</Form.Label>
              <Form.Control
                type="text"
                name="breed"
                placeholder="Enter dog breed"
                value={dog.breed}
                onChange={handleChange}
              />
            </Form.Group>

            {/* Similarly, add other fields like Age, imageUrl, etc. with appropriate type and placeholder */}

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                placeholder="Enter a short description about the dog"
                value={dog.description}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                placeholder="Enter dog price"
                value={dog.price}
                onChange={handleChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Dog
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default DogForm;
