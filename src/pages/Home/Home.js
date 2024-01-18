import React, { useEffect, useState, useRef } from 'react';
import { API, Auth } from 'aws-amplify';
import { GRAPHQL_AUTH_MODE } from '@aws-amplify/api';
import DogCard from '../../components/DogCard/DogCard';
import PetfinderCard from '../../components/DogCard/PetfinderCard'; // Make sure the path is correct!
import { Container, Row, Col, Button } from 'react-bootstrap';
import * as queries from '../../graphql/queries';
import useScrollToTop from '../../helpers/useScrollToTop';
import './Home.css';
import loadingImage from '../../assets/images/loading.gif'

function Home({ isAuthenticated, filterBreed, filterCity, handleLogin }) {
    const [dogs, setDogs] = useState([]);
    const [petfinderAnimals, setPetfinderAnimals] = useState([]); // State for Petfinder animals
    const [nextToken, setNextToken] = useState(null);
    const [prevTokens, setPrevTokens] = useState([]);
    const [currentPage, setCurrentPage] = useState(1); // For frontend pagination
    const itemsPerPage = 10;
    const [isLoading, setIsLoading] = useState(false);
    useScrollToTop();


    useEffect(() => {
        const fetchPetfinderAnimals = async () => {
          setIsLoading(true)
            try {
                // Replace with your Lambda function URL
                const response = await fetch('https://izaaugmn66.execute-api.us-east-1.amazonaws.com/default/getPetfinderToken');
                const data = await response.json();
                const petfinderDogs = data.map(dog => ({
                  ...dog,
                  source: 'petfinder' // Adding source attribute
                }));
                console.log(petfinderDogs)
                setPetfinderAnimals(petfinderDogs);
            } catch (err) {
                console.error('Error fetching Petfinder data:', err);
                // Handle errors as appropriate
            }finally {
              setIsLoading(false);
          }
        };

        fetchPetfinderAnimals();
    }, []);

    const topRef = useRef(null);

    useEffect(() => {
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, [currentPage]);


    const combinedDogs = [...dogs, ...petfinderAnimals];


    const filteredCombinedDogs = combinedDogs.filter(dog => {
      let breedMatch = true;
      let locationMatch = true;

      // For local data
      if (dog.source === 'local') {
        if (filterBreed) {
          breedMatch = dog.breed ? dog.breed.toLowerCase().includes(filterBreed.toLowerCase()) : false;
        }
        if (filterCity) {
          locationMatch = dog.location ? dog.location.toLowerCase().includes(filterCity.toLowerCase()) : false;
        }
      }
      // For Petfinder data
      else if (dog.source === 'petfinder') {
        if (filterBreed) {
          breedMatch = dog.breeds.primary ? dog.breeds.primary.toLowerCase().includes(filterBreed.toLowerCase()) : false;
        }
        if (filterCity) {
          const fullLocation = `${dog.contact.address.city}, ${dog.contact.address.state}`;
          locationMatch = fullLocation.toLowerCase().includes(filterCity.toLowerCase());
        }
      }

      return breedMatch && locationMatch;
    });



// Instead of using filteredDogs directly, we slice it to get the dogs for the current page
const totalPages = Math.ceil(filteredCombinedDogs.length / itemsPerPage);
const startIndex = (currentPage - 1) * itemsPerPage;
const endIndex = startIndex + itemsPerPage;
const dogsToDisplay = filteredCombinedDogs.slice(startIndex, endIndex);


const generatePageNumbers = () => {
  let start = Math.max(currentPage - 2, 1);
  let end = Math.min(start + 4, totalPages);
  return Array.from({length: (end - start + 1)}, (_, i) => start + i);
};
const pageNumbers = generatePageNumbers();




const handleFrontendNextPage = () => {
  if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
  }
};

const handleFrontendPrevPage = () => {

  if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
  }
};

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
  //console.log("City Filter:", handleLogin);
}, [filterBreed, filterCity,handleLogin]);


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
            limit: 5000,
            nextToken: token
          },
          authMode: GRAPHQL_AUTH_MODE.API_KEY
        });

        //console.log(dogData.data.listDogs.items )
        const dogsList = dogData.data.dogByDate.items.map(dog => ({
          ...dog,
          age: calculateAge(dog.birthDate),
          imageUrls: dog.imageUrls || "default_image_url_here",
          source: 'local' // Adding source attribute
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


return (
  <div className='dogBg' ref={topRef}>
       <Container>

       {isLoading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <img src={loadingImage} alt="Loading..." />
              </div>

      ) : (
        <>
{dogsToDisplay.length === 0 ? (
    <div>No dogs match the selected filters.</div>
) : (
    dogsToDisplay.map(dog => (
        <Row className="justify-content-center mb-4" key={dog.id}>
            <Col md={6} className="d-flex justify-content-center">
                {dog.source === 'petfinder' ? (
                    <PetfinderCard animal={dog} />
                ) : (
                    <DogCard dog={dog} age={dog.age} />
                )}
            </Col>
        </Row>
    ))
)}


    {/* Frontend Pagination controls */}

    <Row className="justify-content-center mb-4">
    <Col md={6} className="d-flex justify-content-between align-items-center">
        {/* Prev Button */}
        <Button variant="secondary" onClick={handleFrontendPrevPage} disabled={currentPage === 1}>
            Prev
        </Button>

        {/* Page Numbers */}
        {/* Page Numbers */}
<div className="d-flex justify-content-center">
    {pageNumbers.map(page => (
        <Button
            key={page}
            variant={page === currentPage ? "primary" : "secondary"}
            onClick={() => setCurrentPage(page)}
            className="mr-2"  // added spacing class here
            style={{ marginRight: "10px" }}  // added inline style for spacing
        >
            {page}
        </Button>
    ))}
</div>


        {/* Next Button */}
        <Button
    variant="secondary"
    onClick={handleFrontendNextPage}
    disabled={currentPage * itemsPerPage >= filteredCombinedDogs.length}>
    Next
</Button>

    </Col>
</Row>

<Row className="justify-content-center mb-4">
    <Col md={6} className="d-flex justify-content-center">
        <div>Total Records: {filteredCombinedDogs.length}</div>
    </Col>
</Row>

</>
      )}
  </Container>

  </div>

);
    }

export default Home;
