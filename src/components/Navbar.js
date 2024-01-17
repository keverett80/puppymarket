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
import { useLocation } from 'react-router-dom';



function NavbarComponent({ isAuthenticated, setIsAuthenticated, onFilterChange }) {
  const navigate = useNavigate();
  const location = useLocation(); // Get the current location
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
// In your NavbarComponent
const handleLoginClick = () => {
  setLoginClicked(true);
  navigate('/paw-home');
};

const handleRegisterClick = () => {
  setLoginClicked(true);
    navigate('/paw-home');
};



  const handleLogin = () => {
    // 2. Modify the handleLogin function
    console.log("handleLogin function triggered!");
    setLoginClicked(true);
    navigate('/home');
  };
  const handleHome = () => {

    navigate('/');
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

<Navbar expand="lg" style={{ backgroundColor: 'transparent', border: '1px solid #e8e8e8' }}>


    <Container fluid>
      <Navbar.Brand  href='/' className="text-primary font-weight-bold"><FontAwesomeIcon icon={faPaw} className="mr-2" /> Little Paws Place</Navbar.Brand>
      <Navbar.Toggle aria-controls="navbarScroll" />
      <Navbar.Collapse id="navbarScroll">


              <>

<Button variant="primary" onClick={handleHome}>
                  <i className='fas fa-home'> Paw Home</i>
                </Button>
              </>


        <Nav className="me-auto my-2 my-lg-0" style={{ maxHeight: '100px' }} navbarScroll>
          {isAuthenticated && <Nav.Link href="/add-dog" className="text-primary font-weight-bold">Add Dog</Nav.Link>}
          {isAuthenticated && <Nav.Link href="/profile" className="text-primary font-weight-bold">Profile</Nav.Link>}
        </Nav>
        {!isAuthenticated && (
          <div className="ml-auto" style={{ display: 'flex' }}>
              <Button variant="outline-primary" onClick={handleLoginClick} className="mr-2 mx-2">
                Login
              </Button>
              <Button variant="primary" onClick={handleRegisterClick} className='mx-2'>
                Register
              </Button>
            </div>
          )}

        {/* Grouped form elements */}
        {(location.pathname === '/view-pups' || location.pathname === '/home') && (
            <Form className="d-flex align-items-center">
              <Form.Control
                type="text"
                className="text-primary font-weight-bold"
                placeholder="Breed"
                onChange={handleBreedChange}
                style={{ marginRight: '10px' }}
              />
              <Form.Control
                type="text"
                placeholder="City"
                className="text-primary font-weight-bold"
                onChange={handleCityChange}
                style={{ marginRight: '10px' }}
              />
            </Form>
          )}

          {/* Logout button always visible when authenticated */}
          {isAuthenticated && (
            <Button
              variant="outline-primary"
              onClick={handleLogout}
              style={{ marginRight: '10px' }}
            >
              Logout
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
</Navbar>





  );
}

export default NavbarComponent;
