import React, { useEffect, useState } from 'react';
import { API, graphqlOperation } from 'aws-amplify';
import { listDogs } from '../../graphql/queries';
import DogCard from  '../../components/DogCard/DogCard';  // Make sure the path is correct!
import { Container, Row, Col } from 'react-bootstrap';

function Home() {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async () => {
    try {
      const dogData = await API.graphql(graphqlOperation(listDogs));
      const dogsList = dogData.data.listDogs.items;
      setDogs(dogsList);
    } catch (error) {
      console.error("Error fetching dogs:", error);
    }
  };

  return (
    <Container>
      <Row>
        {dogs.map(dog => (
          <Col md={4} key={dog.id}>
            <DogCard dog={dog} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;
