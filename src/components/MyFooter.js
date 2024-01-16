import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw, faHeart } from '@fortawesome/free-solid-svg-icons';
import './Footer.css';
import { faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="footer-links-row">
          {/* Category 1 */}
          <Col md={4} sm={6} xs={12} className="footer-category">
            <h5>RESOURCES</h5>
            <ul className="footer-links">
              <li><a href="https://www.humanesociety.org/">The Humane Society</a></li>
              <li><a href="#link2">Mobile App Download</a></li>
              <li><a href="#link3">Partnerships</a></li>
              <li><a href="#link3">News Center</a></li>
              {/* More links */}
            </ul>
          </Col>

          {/* Category 2 */}
          <Col md={4} sm={6} xs={12} className="footer-category">
            <h5>ABOUT DOGS & PUPPIES</h5>
            <ul className="footer-links">
              <li><a href="#link3">All About Dogs & Puppies</a></li>
              <li><a href="#link4">Dog Adoption</a></li>
              <li><a href="#link3">Dog Breeds</a></li>
              <li><a href="#link3">Feeding Your Dog</a></li>
              {/* More links */}
            </ul>
          </Col>

          {/* Category 3 */}
          <Col md={4} sm={6} xs={12} className="footer-category">
            <h5>ADOPT OR GET INVOLVED</h5>
            <ul className="footer-links">
              <li><a href="#link5">All Adopt or Get Involved</a></li>
              <li><a href="#link6">Adopting Pets</a></li>
              <li><a href="#link3">Animal Shelters & Rescues</a></li>
              <li><a href="#link3">Other Types of Pets</a></li>
              {/* More links */}
            </ul>
          </Col>
        </Row>

        <Row>
          <Col className="text-center py-3">
            <FontAwesomeIcon icon={faPaw} className="mr-2" />{' '}
            &copy;{' '} {new Date().getFullYear()} Pets {' '}
            <FontAwesomeIcon icon={faHeart} className="ml-2" />
          </Col>
          <Col className="text-right">
  <a href="https://twitter.com/littlepawsplace" target="_blank" rel="noopener noreferrer">
    <FontAwesomeIcon icon={faTwitter} className="social-icon" />
  </a>
  {/* mx-2 or mx-3 can be adjusted for desired spacing */}
  <a href="https://www.instagram.com/littlepawsplace/" target="_blank" rel="noopener noreferrer" className="mx-2">
    <FontAwesomeIcon icon={faInstagram} className="social-icon" />
  </a>
</Col>

        </Row>
      </Container>

    </footer>
  );
};

export default Footer;
