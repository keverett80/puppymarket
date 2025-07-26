import React from 'react';
import { Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './Landing.css';
import runningAnimals from '../assets/images/loading1.gif'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DonationCard from '../pages/DonationCard/DonationCard'
import { faTwitter, faTiktok } from '@fortawesome/free-brands-svg-icons'
import {
  faPaw,
  faCirclePlus,
  faHeartCircleCheck
} from '@fortawesome/free-solid-svg-icons';


export default function LandingPage() {
  const navigate = useNavigate();

const tiles = [
  {
    title: "Browse Animals",
    icon: faPaw,
    path: "/view-pups",
    color: "#4e73df",
    textColor: "white",
    description: "Find your next companion — dog, cats, goats and more...",
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
<p className="lead">
  Every listing helps a pet find love — and gets shared across our social platforms to reach even more hearts. 🐾
</p>

          <div className="d-flex justify-content-center gap-3 mt-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/view-pups')}>
              Browse Listings
            </Button>
            <Button variant="outline-light" size="lg" onClick={() => navigate('/add-dog')}>
              Create a Listing
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
{/* Donation Section */}
<section className="donation-section text-center py-5 bg-light">
  <Container>
    <h3 className="mb-3">Support Our Mission 🐾</h3>
    <p className="mb-4">
      Your donations help us rescue, list, and rehome animals in need. Every dollar makes a difference.
    </p>
    <div className="d-flex justify-content-center gap-3 flex-wrap">
      <Button
        variant="danger"
        href="https://www.paypal.com/donate/?hosted_button_id=TVRSFUFEUX9LJ"
        target="_blank"
        rel="noopener noreferrer"
      >
        Donate via PayPal
      </Button>
      <Button
            variant="success"
            href="https://cash.app/$LittlePawsPlace"
            target="_blank"
            rel="noopener noreferrer"
          >
            Donate via Cash App
          </Button>
      <Button
        variant="warning"
        href="https://www.buymeacoffee.com/littlepawsplace"
        target="_blank"
        rel="noopener noreferrer"
      >
        Buy Me a Coffee ☕
      </Button>
    </div>
  </Container>
</section>


      {/* Footer Section */}
<footer className="text-center py-4 text-muted">
  <p className="mb-1">Made with 🐾 by LittlePawPlace</p>
  <p>
    <a href="/about">About</a> |{" "}
    <a href="/contact">Contact</a> |{" "}
    <a href="/term-service">Terms</a> |{" "}
    <a href="/privacy-policy">Privacy</a>
  </p>
  <p className="mt-2">
    <a
      href="https://www.tiktok.com/@littlepawsplaces"
      target="_blank"
      rel="noopener noreferrer"
      className="me-3"
    >
      <FontAwesomeIcon icon={faTiktok} /> TikTok
    </a>
    <a
      href="https://twitter.com/littlepawsplace"
      target="_blank"
      rel="noopener noreferrer"
    >
      <FontAwesomeIcon icon={faTwitter} /> Twitter
    </a>
  </p>
</footer>


    </div>
  );
}