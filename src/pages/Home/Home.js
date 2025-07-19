import React, { useEffect, useState, useRef, useCallback } from 'react';
import { API } from 'aws-amplify';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import { dogByDate } from '../../graphql/queries';
import DogCard from '../../components/DogCard/DogCard';
import PetfinderCard from '../../components/DogCard/PetfinderCard';
import { Container, Row, Col, Form, Spinner, Alert } from 'react-bootstrap';
import useScrollToTop from '../../helpers/useScrollToTop';
import { v4 as uuidv4 } from 'uuid';

function Home() {
  const [dogs, setDogs] = useState([]);
  const [petfinderAnimals, setPetfinderAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const scrollContainerRef = useRef(null);

  useScrollToTop();

  const fetchLocalDogs = async () => {
    try {
      const response = await API.graphql({
        query: dogByDate,
        variables: { type: 'Dog', sortDirection: 'DESC', limit: 500 },
        authMode: GRAPHQL_AUTH_MODE.API_KEY
      });
      const localDogs = response.data.dogByDate.items.map(d => ({
        ...d,
        source: 'local',
        uniqueKey: `local-${d.id}`,
      }));
      setDogs(localDogs);
    } catch (err) {
      console.error("Error fetching local dogs:", err);
    }
  };

  const fetchPetfinderAnimals = async () => {
    try {
      const res = await fetch('https://izaaugmn66.execute-api.us-east-1.amazonaws.com/default/getPetfinderToken');
      const data = await res.json();
      const apiPets = data.map(p => ({
        ...p,
        source: 'petfinder',
        uniqueKey: `petfinder-${p.id || p.url || uuidv4()}`,
      }));
      setPetfinderAnimals(apiPets);
    } catch (err) {
      console.error('Error fetching Petfinder:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLocalDogs();
    fetchPetfinderAnimals();
  }, []);

  const combined = [...dogs, ...petfinderAnimals].filter(item => {
    const breed = item.source === 'local' ? item.breed : item.breeds?.primary;
    const location = item.source === 'local'
      ? item.location
      : `${item.contact?.address?.city}, ${item.contact?.address?.state}`;
    return `${breed || ''} ${location || ''}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
  });

  const infiniteList = searchTerm.trim().length > 0 ? combined : [...combined, ...combined];

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      const halfway = container.scrollHeight / 2;
      if (container.scrollTop >= halfway) {
        container.scrollTop -= halfway;
      }
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div
      ref={scrollContainerRef}
      style={{ marginTop: '1rem', height: '80vh', overflowY: 'auto' }}
    >
      <Container>
        <Form.Control
          type="text"
          placeholder="Search pets by breed or city..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="mb-3"
        />

        {isLoading ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: '50vh' }}
          >
            <Spinner animation="border" />
          </div>
        ) : combined.length === 0 ? (
          <Alert variant="info" className="text-center">
            No pets match your search.
          </Alert>
        ) : (
          <Row>
            {infiniteList.map((pet, idx) => (
              <Col
                key={`${pet.uniqueKey}-${idx}`}
                xs={12}
                sm={6}
                md={4}
                className="mb-4"
              >
                {pet.source === 'petfinder' ? (
                  <PetfinderCard animal={pet} />
                ) : (
                  <DogCard dog={pet} />
                )}
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </div>
  );
}

export default Home;
