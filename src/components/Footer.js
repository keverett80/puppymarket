import React from 'react';
import { useLocation } from 'react-router-dom';
import Footer from './MyFooter'; // Adjust the path accordingly

const LayoutWithFooter = ({ children }) => {
  const location = useLocation();

  return (
    <div>
      {children}
      {location.pathname !== '/chat-with-bully' && <Footer />}
    </div>
  );
};

export default LayoutWithFooter;
