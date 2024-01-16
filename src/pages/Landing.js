import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './Landing.css'; // Assuming you still have other styles in this CSS file
import PetCarousel from './PetCarousel/PetCarousel';

function CustomJumbotron() {
  let navigate = useNavigate();



  const tiles = [
    {  title: "Adopt a Pup", icon: "fas fa-dog", path: "/view-pups", color: "#6c757d", description: "Find your new best friend!" },
    { title: "Find a Vet", icon: "fas fa-stethoscope", path: "/find-vet", color: "#28a745", description: "Find your new best friend!"  },
    { title: "Training Guides", icon: "fas fa-paw", path: "/training", color: "#dc3545", description: "Find your new best friend!"  },
    { title: "Chat with Paw", icon: "fas fa-comments", path: "/chat-with-bully", color: "#17a2b8", description: "Find your new best friend!"  },
    { title: "Pet Insurance", icon: "fas fa-heartbeat", path: "/insurance", color: "#301934", description: "Find your new best friend!"  },
    { title: "Community Events", icon: "fas fa-calendar-alt", path: "/events", color: "#007bff", description: "Find your new best friend!"  }
  ];


  const handleTileClick = (path) => {
    navigate(path);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    },
    exit: { opacity: 0, transition: { duration: 0.5 } }
  };

  const tileVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <div>
    <motion.div
    className="tile-container"
    variants={containerVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
  >

      <Row>
        {tiles.map((tile, index) => (
          <Col xs={12} md={6} lg={4} key={index}>
             <motion.div variants={tileVariants}>
            <Card className="tile" onClick={() => handleTileClick(tile.path)}
                  style={{ backgroundColor: tile.color, color: tile.color === '#ffc107' ? 'black' : 'white' }}>
              <Card.Body>
                <div className="icon-placeholder">
                  <i className={tile.icon}></i>
                </div>
                <Card.Title>{tile.title}</Card.Title>
                <Card.Text>
                  {tile.description}
                </Card.Text>
              </Card.Body>
            </Card>
            </motion.div>
          </Col>
        ))}
      </Row>

    </motion.div>
    <div className="full-height-section image-section">

        <div className="content">
          <h2>A Special Section</h2>
          <p>Explore more about our community and activities.</p>
          <div className="buttons">
            <button className="btn btn-primary">Learn More</button>
            <button className="btn btn-secondary">Join Us</button>
          </div>
        </div>
      </div>

      {/* Another Full-Height Section */}
      <div className="full-height-section another-section">
        <div className="video-container">
        <iframe  src="https://www.youtube.com/embed/tKb4vUPpQzo?si=7RcpyQeTmklAz8Ld" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
      </div>

      {/* Footer (Can be full height or not, as per your design) */}
      <footer className="site-footer">
      <PetCarousel />
    </footer>
    </div>
  );
}

export default CustomJumbotron;
