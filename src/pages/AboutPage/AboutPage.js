import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-lg border-0">
            <Card.Body>
              <h2 className="mb-3 text-center text-primary">🐾 About LittlePawsPlace 🏡</h2>

              <p>
                Welcome to <strong>LittlePawsPlace</strong> — where compassion meets connection! 🐶🐱🐾
              </p>

              <p>
                Our mission is simple but powerful:
                <ul>
                  <li>📝 <strong>List pets easily</strong> for rehoming — whether it’s your own or a rescue needing help.</li>
                  <li>🔍 <strong>Match adopters</strong> with pets from our community AND national shelters.</li>
                </ul>
              </p>

              <p>
                We work with trusted sources like <strong>Petfinder</strong> to make sure every adoptable animal gets a chance to shine ✨. Plus, we post regularly to TikTok and Twitter to boost visibility across the web 🌐.
              </p>

              <p>
                💖 Whether you’re adopting or posting, LittlePawsPlace is a safe and uplifting space for all animal lovers. We believe in <em>#AdoptDontShop</em> and helping the forgotten paws find forever homes.
              </p>

              <p className="mt-4 text-center">
                Let’s change lives together — one paw at a time 🐾💫
              </p>

              <div className="text-center mt-4">
                <Button
                  href="/view-pups"
                  variant="primary"
                  className="me-2"
                >
                  🐶 Browse Pets
                </Button>
                <Button
                  href="/contact-support"
                  variant="outline-secondary"
                >
                  ✉️ Contact Us
                </Button>
              </div>

              <div className="text-center mt-4">
                <Button variant="light" onClick={() => navigate(-1)}>
                  ⬅️ Back
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
