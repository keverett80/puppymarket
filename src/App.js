import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch, NavLink, Routes } from 'react-router-dom';
import './authStyles.css';
import Footer from './components/MyFooter'; // Adjust the path accordingly

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import Home from './pages/Home/Home';
import AddDog from './pages/AddDog/AddDog';
import NavbarComponent from './components/Navbar';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import { Container } from 'react-bootstrap';
import {Amplify, Auth, Hub} from 'aws-amplify';
import LoginPage from './pages/Auth/LoginPage';
import DogDetails from './pages/DogDetails/DogDetails';
import PetMatchQuiz from './pages/Chat/PetMatchQuiz';
import InstagramOauthCallback from './pages/instagram-oauth-callback';
import CustomJumbotron from '../src/pages/Landing';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService/TermsOfService';
import './App.css'; // Import your CSS file for styling
import awsconfig from './aws-exports';
import { AnimatePresence } from 'framer-motion';

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
    <Router>    <AnimatePresence>
      <div className="app-container">
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

<Route path="/paw-home" element={
              <ProtectedRoute>
                 <CustomJumbotron />
              </ProtectedRoute>
            } />



{<Route path="/login" element={<LoginPage />} />}

{ <Route path="/pet-match" element={  <PetMatchQuiz />} /> }
{ <Route path="/privacy-policy" element={  <PrivacyPolicy />} /> }
{ <Route path="/term-service" element={  <TermsOfService />} /> }
{ <Route path="/oauth/instagram" element={  <InstagramOauthCallback />} /> }
  {<Route path="/" element={  <CustomJumbotron isAuthenticated={isAuthenticated}  />} />}
{           <Route path="/view-pups" element={ <Home isAuthenticated={isAuthenticated} filterBreed={filterBreed} filterCity={filterCity} />

} />}

          </Routes>
        </Container>

      </div>
      </AnimatePresence>
    </Router>

  );

}

export default App;
