import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch, NavLink, Routes } from 'react-router-dom';
import './authStyles.css';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Home from './pages/Home/Home';
import AddDog from './pages/AddDog/AddDog';
import { Navbar, Nav, Container } from 'react-bootstrap';
import {Amplify, Auth} from 'aws-amplify';



import './App.css'; // Import your CSS file for styling
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);
Auth.currentAuthenticatedUser()
  .then(user => console.log(user))
  .catch(err => console.log(err));

function App() {
  return (
    <Router>
      <div>
        {/* Navigation */}
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/">Dog Sale</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="ml-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/add-dog">Add Dog</Nav.Link>
                {/* Add more Nav.Links as you add more routes */}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        {/* Route Definitions */}
        <Container className="mt-4">
          <Routes>
            <Route path="/add-dog" element={<AddDog />} />
            <Route path="/" element={<Home />} exact />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}



export default withAuthenticator(App);


