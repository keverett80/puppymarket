import React, { useState, useEffect } from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
function Login() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/');
  }, []);
  return null; // or a loading spinner, if desired
}
