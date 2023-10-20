import React, { useEffect, useState } from 'react';
import { API, Auth } from 'aws-amplify';

import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import DogCard from  '../../components/DogCard/DogCard';  // Make sure the path is correct!
import { Container, Row, Col } from 'react-bootstrap';
import * as queries from '../../graphql/queries';
import { Button } from 'react-bootstrap';


import CustomJumbotron from '../Landing';


function Home({ isAuthenticated, filterBreed, filterCity, handleLogin }) {
  const [dogs, setDogs] = useState([]);
  const [nextToken, setNextToken] = useState(null);
  const [prevTokens, setPrevTokens] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // NEW: For frontend pagination
  const itemsPerPage = 10;


  const filteredDogs = dogs.filter(dog => {
    return (dog.breed ? dog.breed.toLowerCase().includes(filterBreed.toLowerCase()) : true) &&
           (dog.location ? dog.location.toLowerCase().includes(filterCity.toLowerCase()) : true);
});
// Instead of using filteredDogs directly, we slice it to get the dogs for the current page
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const dogsToDisplay = filteredDogs.slice(startIndex, endIndex);

const handleFrontendNextPage = () => {
  setCurrentPage(currentPage + 1);
  window.scrollTo(0, 0);
};

const handleFrontendPrevPage = () => {
  if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
  }
}
const calculateAge = birthDateStr => {
  const birthDate = new Date(birthDateStr);
  const today = new Date();

  // Difference in milliseconds
  const diffInMs = today - birthDate;

  // Difference in days
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays < 30) {
    return `${Math.floor(diffInDays)} day(s)`;
  }

  // Difference in months
  const diffInMonths = diffInDays / 30;
  if (diffInMonths < 12) {
    return `${Math.floor(diffInMonths)} month(s)`;
  }

  // Difference in years
  const diffInYears = diffInMonths / 12;
  return `${Math.floor(diffInYears)} year(s)`;
};


useEffect(() => {
  //console.log("Breed Filter:", filterBreed);
  //console.log("City Filter:", filterCity);
}, [filterBreed, filterCity]);


  useEffect(() => {
    fetchDogs();
  }, []);

  const fetchDogs = async (token = null) => {
    try {
        let options = {};

        try {
            const currentUser = await Auth.currentAuthenticatedUser();
            console.log("Current User: ");
            options.authMode = 'AMAZON_COGNITO_USER_POOLS';
        } catch (e) {
            console.log("No authenticated user. Using API key. ");
            options.authMode = 'API_KEY';
        }

        const dogData = await API.graphql({
          query: queries.dogByDate,
          variables: {
            type: 'Dog',
            sortDirection: 'DESC',
            limit: 2000,
            nextToken: token
          },
          authMode: GRAPHQL_AUTH_MODE.API_KEY
        });

        //console.log(dogData.data.listDogs.items )
       const dogsList = dogData.data.dogByDate.items.map(dog => ({
        ...dog,
        age: calculateAge(dog.birthDate),
        imageUrls: dog.imageUrls || "default_image_url_here"
      }));

       setDogs(dogsList);
       if (nextToken) {
        setPrevTokens([...prevTokens, nextToken]);
    }
    setNextToken(dogData.data.dogByDate.nextToken); // or dogData.data.listDogs.nextToken, based on which query you use

    } catch (error) {
       console.error("Error fetching dogs:", error);
    }
  };
  const handleNextPage = () => {
    if (nextToken) {
      fetchDogs(nextToken);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevPage = async () => {
    // Get the last token from the stack
    const prevToken = prevTokens.pop();

    // Update prevTokens state without the last token
    setPrevTokens(prevTokens);

    await fetchDogs(prevToken);
    window.scrollTo(0, 0);
};

return (
  <Container>
    {!isAuthenticated && (
      <CustomJumbotron isAuthenticated={isAuthenticated} handleLogin={handleLogin} />
    )}

    {filteredDogs.length === 0 ? (
      <div>No dogs match the selected filters.</div>
    ) : (

      dogsToDisplay
.sort((a, b) => new Date(b.dateListed) - new Date(a.dateListed))  // Sorting in descending order
.map(dog => (
      <Row className="justify-content-center mb-4" key={dog.id}>
        <Col md={6} className="d-flex justify-content-center">
          <DogCard dog={dog} age={dog.age} />

        </Col>
      </Row>
    )))}

    {/* Frontend Pagination controls */}
    <Row className="justify-content-center mb-4">
      <Col md={6} className="d-flex justify-content-between">
        <Button variant="secondary" onClick={handleFrontendPrevPage} disabled={currentPage === 1}>Prev (frontend)</Button>
        <Button variant="secondary" onClick={handleFrontendNextPage} disabled={currentPage * itemsPerPage >= filteredDogs.length}>Next (frontend)</Button>
      </Col>
    </Row>

    {/* Backend Pagination controls */}
    <Row className="justify-content-center mb-4">
      <Col md={6} className="d-flex justify-content-between">
        <Button variant="primary" onClick={handlePrevPage} disabled={prevTokens.length === 0}>Previous Page</Button>
        <Button variant="primary" onClick={handleNextPage} disabled={!nextToken}>Next Page</Button>
      </Col>
    </Row>
  </Container>
);
    }

export default Home;
