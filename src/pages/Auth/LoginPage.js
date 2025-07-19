import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <Authenticator>
      <LoginRedirect navigate={navigate} />
    </Authenticator>
  );
}

function LoginRedirect({ navigate }) {
  const { user } = useAuthenticator();

  useEffect(() => {
    if (user) {
      navigate('/profile');
    }
  }, [user, navigate]);

  return (
    <div
      className="auth-wrapper"
      style={{ display: 'flex', justifyContent: 'center', paddingTop: '80px' }}
    >
      {/* You can optionally show a loader here while checking authentication */}
    </div>
  );
}
