import React from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import runningAnimals from '../assets/images/loading1.gif'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPaw,
  faCirclePlus,
  faHeartCircleCheck
} from '@fortawesome/free-solid-svg-icons';


export default function LandingPage() {
  const navigate = useNavigate();

const tiles = [
  {
    title: "Browse Listings",
    icon: faPaw,
    path: "/view-pups",
    color: "#4e73df",
    textColor: "white",
    description: "Find your next companion — dog, cat, or critter.",
  },
  {
    title: "Create a New Listing",
    icon: faCirclePlus,
    path: "/add-dog",
    color: "#1cc88a",
    textColor: "white",
    description: "Give a pet a fresh start and a loving home.",
  },
  {
    title: "Find Your Match",
    icon: faHeartCircleCheck,
    path: "/pet-match",
    color: "#f39c12",
    textColor: "#111",
    description: "Take our quiz — discover your perfect pet match.",
  }
];




  return (
    <div className="landing-wrapper">


      {/* Hero Section */}
      <section className="hero-section text-blue text-center d-flex align-items-center justify-content-center">
        <Container>
  <div className="hero-animation-wrapper">
  <img src={runningAnimals} alt="Running cat and dog animation" className="hero-animation" />
</div>

          <h1 className="display-4 fw-bold">Find a Home. Give a Home.</h1>
          <p className="lead">Helping pets find their forever families with one simple step.</p>
          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/view-pups')}>
              Browse Pups
            </Button>
            <Button variant="outline-light" size="lg" onClick={() => navigate('/add-dog')}>
              List My Pup
            </Button>
          </div>
        </Container>
      </section>

      {/* Tile Navigation Section */}
      <section className="tile-section py-5">
  <Container>
    <Row className="justify-content-center g-4">
      {tiles.map((tile, idx) => (
        <Col key={idx} xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center">
          <Card
            className="text-center h-100 tile"
            style={{
              backgroundColor: tile.color,

              width: '100%',
              maxWidth: '260px',
              cursor: 'pointer',
            }}
            onClick={() => navigate(tile.path)}
          >
            <Card.Body>
              <div className="mb-3">
                <FontAwesomeIcon icon={tile.icon} size="2x" />

              </div>
              <Card.Title>{tile.title}</Card.Title>
              <Card.Text>{tile.description}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </Container>
</section>


      {/* Footer Section */}
      <footer className="text-center py-4 text-muted">
        <p className="mb-1">Made with 🐾 by LittlePawPlate</p>
        <p>
          <a href="/about">About</a> | <a href="/contact">Contact</a> | <a href="/terms">Terms</a>
        </p>
      </footer>
    </div>
  );
}