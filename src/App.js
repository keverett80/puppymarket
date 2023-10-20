import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch, NavLink, Routes } from 'react-router-dom';
import './authStyles.css';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Home from './pages/Home/Home';
import AddDog from './pages/AddDog/AddDog';
import NavbarComponent from './components/Navbar';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { Navbar, Nav, Container } from 'react-bootstrap';
import {Amplify, Auth, Hub} from 'aws-amplify';
import { useNavigate } from 'react-router-dom';
import Landing from './pages/Landing';
import DogDetails from './pages/DogDetails/DogDetails';

import './App.css'; // Import your CSS file for styling
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [filterBreed, setFilterBreed] = useState("");
  const [filterCity, setFilterCity] = useState("");

  const handleFilterChange = (breed, city) => {
    setFilterBreed(breed);
    setFilterCity(city);
  };


  useEffect(() => {
    const listener = (data) => {
        switch (data.payload.event) {
            case 'signIn':
                setIsAuthenticated(true);
                break;
            case 'signOut':
                setIsAuthenticated(false);
                break;
            default:
                break;
        }
    };

    Hub.listen('auth', listener);

    // Check the initial auth state
    checkAuthState();

    // Clean up the listener when the component is unmounted
    return () => Hub.remove('auth', listener);
  }, []);

  const checkAuthState = async () => {
    try {
      await Auth.currentAuthenticatedUser();
      setIsAuthenticated(true);
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  const login = () => {
    Auth.signIn();
  };

  return (
    <Router>
      <div>
        {/* Navigation */}
        <NavbarComponent
          isAuthenticated={isAuthenticated}
          setIsAuthenticated={setIsAuthenticated}
          onFilterChange={handleFilterChange}
        />


        {/* Route Definitions */}
        <Container className="mt-4">
          <Routes>
            <Route path="/add-dog" element={
              <ProtectedRoute>
                <AddDog />
              </ProtectedRoute>
            } />
                <Route path="/home" element={
              <ProtectedRoute>
                 <Home isAuthenticated={isAuthenticated} filterBreed={filterBreed} filterCity={filterCity} />
              </ProtectedRoute>
            } />


            <Route path="/dogs/:id" element={<DogDetails />} /> {/* Removed ProtectedRoute */}
            <Route path="/profile" element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } />
            <Route path="/" element={ <Home isAuthenticated={isAuthenticated} filterBreed={filterBreed} filterCity={filterCity} />
} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
