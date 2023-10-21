import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';


function NavbarComponent({ isAuthenticated, setIsAuthenticated, onFilterChange }) {
  const navigate = useNavigate();
  const [loginClicked, setLoginClicked] = useState(false);
  const [filterBreed, setFilterBreed] = useState("");
const [filterCity, setFilterCity] = useState("");

  const handleLogout = async () => {
    try {
        await Auth.signOut();
        setIsAuthenticated(false); // Set authentication state to false
        setLoginClicked(false);   // Hide the "Cancel Login" button
        navigate('/');
    } catch (error) {
        console.error('Error signing out: ', error);
    }
};
const handleBreedChange = (event) => {
  setFilterBreed(event.target.value); // Save the breed to state
  onFilterChange(event.target.value, filterCity); // Send breed and current city to the parent
};

const handleCityChange = (event) => {
  setFilterCity(event.target.value); // Save the city to state
  onFilterChange(filterBreed, event.target.value); // Send current breed and city to the parent
};



  const handleLogin = () => {
    // 2. Modify the handleLogin function
    console.log("handleLogin function triggered!");
    setLoginClicked(true);
    navigate('/home');
  };

  const handleCancelLogin = () => {
    // 4. Modify the handleCancelLogin function
    setLoginClicked(false);
    navigate('/');
  }
  const applyFilter = () => {
    onFilterChange(filterBreed, filterCity);
};
const fetchBrowserLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(handlePositionSuccess, handlePositionError);
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
};

const handlePositionSuccess = async (position) => {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyAdnS_bTUUA8hlPRJkr0tDPBZ_vdA4hH9Y`);
    const data = await response.json();
    console.log(data)
    const addressComponents = data.results[0].address_components;
    const cityComponent = addressComponents.find(component => component.types.includes('locality'));
    const city = cityComponent ? cityComponent.long_name : "";


  } catch (error) {
    console.error("Error converting coordinates to location:", error);
  }
};


const handlePositionError = (error) => {
  console.error("Error fetching location:", error.message);
};


useEffect(() => {
  fetchBrowserLocation();
}, []);




  return (

<Navbar expand="lg" style={{backgroundColor: '#e8e8e8'}}>


    <Container fluid>
      <Navbar.Brand onClick={handleLogin}href='#'  className="text-primary font-weight-bold"><FontAwesomeIcon icon={faPaw} className="mr-2" /> Little Paws Place</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse id="navbarScroll">
      {!isAuthenticated && (

              <>

<Button variant="primary" onClick={handleLogin}>Learn More</Button>
              </>
          )}
        <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
          {isAuthenticated && <Nav.Link href="/add-dog" className="text-primary font-weight-bold">Add Dog</Nav.Link>}
          {isAuthenticated && <Nav.Link href="/profile" className="text-primary font-weight-bold">Profile</Nav.Link>}
        </Nav>

        {/* Grouped form elements */}
        <Form className="d-flex align-items-center">
            <Form.Control
                type="text"
                className="text-primary font-weight-bold"
                placeholder="Breed"
                onChange={handleBreedChange}
                style={{ marginRight: '10px' }}  // inline style for spacing
            />
              <Form.Control
        type="text"
        placeholder="City"
        className="text-primary font-weight-bold"
        onChange={handleCityChange}
        style={{ marginRight: '10px' }}  // inline style for spacing
    />
            {isAuthenticated && (
                <Button
                    variant="outline-primary"
                    className="font-weight-bold"
                    onClick={handleLogout}
                    style={{ marginRight: '10px' }}  // inline style for spacing
                >
                    Logout
                </Button>
            )}
            {!isAuthenticated && (

                <>
                    {loginClicked && (
                       <Button
                       className="btn-on-top  font-weight-bold"
                       variant="warning"
                       onClick={handleCancelLogin}
                       style={{ marginRight: '10px', color: 'white' }}  // added color property here
                   >
                       Cancel
                   </Button>

                    )}
                    <Button
                        variant="outline-primary"
                        className="font-weight-bold"
                        onClick={handleLogin}
                        style={{ marginRight: '10px' }}  // inline style for spacing
                    >
                        Login
                    </Button>
                </>
            )}
        </Form>
      </Navbar.Collapse>
    </Container>
</Navbar>





  );
}

export default NavbarComponent;
