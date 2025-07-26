import React, { useEffect, useState, useRef, useCallback } from 'react';
import { API } from 'aws-amplify';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import { dogByDate } from '../../graphql/queries';
import DogCard from '../../components/DogCard/DogCard';
import PetfinderCard from '../../components/DogCard/PetfinderCard';
import { Container, Row, Col, Form, Spinner, Alert } from 'react-bootstrap';
import useScrollToTop from '../../helpers/useScrollToTop';
import { v4 as uuidv4 } from 'uuid';
import DonationBanner from '../../pages/DonationCard/DonationBanner'; // ⬅️ import this at the top


const US_STATES = [
  '', 'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA',
  'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY',
  'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX',
  'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];


function Home() {
  const [dogs, setDogs] = useState([]);
  const [petfinderAnimals, setPetfinderAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const scrollContainerRef = useRef(null);
const [selectedState, setSelectedState] = useState('');

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
     const apiPets = Array.isArray(data) ? data.map(p => ({
  ...p,
  source: 'petfinder',
  uniqueKey: `petfinder-${p.id || p.url || uuidv4()}`,
})) : [];

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
  const breedOrType =
    item.source === 'local'
      ? item.breed || item.type || ''
      : item.breeds?.primary || item.species || item.type || '';


  const state = item.source === 'local'
  ? (item.state || '').toUpperCase()
  : (item.contact?.address?.state || '').toUpperCase();


 const location =
  item.source === 'local'
    ? `${item.location || ''}, ${item.state || ''}`
    : `${item.contact?.address?.city || ''}, ${item.contact?.address?.state || ''}`;


  const searchableText = `${breedOrType} ${location} ${item.name || ''} ${item.description || ''}`.toLowerCase();

  const matchesSearch = searchableText.includes(searchTerm.toLowerCase());
  const matchesState = !selectedState || state === selectedState;

  return matchesSearch && matchesState;
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
     <Container>  <DonationBanner />
  <div
    style={{
      position: 'sticky',
      top: 0,
      backgroundColor: 'white',
      zIndex: 1000,
      paddingTop: '1rem',
      paddingBottom: '0.5rem',
    }}
  ><Form.Select
  value={selectedState}
  onChange={e => setSelectedState(e.target.value)}
  className="mb-3"
>
  <option value="">Filter by state (optional)</option>
  {US_STATES.filter(s => s).map(state => (
    <option key={state} value={state}>
      {state}
    </option>
  ))}
</Form.Select>

    <Form.Control
      type="text"
      placeholder="Search pets ..."
      value={searchTerm}
      onChange={e => setSearchTerm(e.target.value)}
      className="mb-3"
    />
      {/* ✅ Donation callout */}

  </div>

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
