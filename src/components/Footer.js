// Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faHeart } from '@fortawesome/free-solid-svg-icons';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <Container fluid>
        <Row>
          <Col className="text-center py-3">
            <FontAwesomeIcon icon={faPaw} className="mr-2" /><span> </span>
            &copy; {new Date().getFullYear()} Little Paws Place<span> </span>
            <FontAwesomeIcon icon={faHeart} className="ml-2" />
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
