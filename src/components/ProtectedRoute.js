// src/components/ProtectedRoute.js
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from 'aws-amplify';

export default function ProtectedRoute({ children }) {
  const [authenticated, setAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(() => setAuthenticated(true))
      .catch(() => {
        setAuthenticated(false);
        navigate('/login');
      });
  }, []);

  if (authenticated === null) return null;

  return children;
}
