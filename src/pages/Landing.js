import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col } from 'react-bootstrap';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import './Landing.css';
import PetCarousel from './PetCarousel/PetCarousel';
import useScrollToTop from '../helpers/useScrollToTop';




function CustomJumbotron() {
  let navigate = useNavigate();
  const controls = useAnimation();

  useScrollToTop();



  const tiles = [

    { title: "Paw Best Bites", icon: "fas fa-bone", path: "/coming-soon", color: "#28a745", description: "Feeding Every Paw with Care!"  },
    { title: "Pawsitive Training", icon: "fas fa-paw", path: "/coming-soon", color: "#dc3545", description: "Unleashing Potential, One Paw at a Time!"  },
    { title: "Chat with Paw", icon: "fas fa-comments", path: "/chat-with-bully", color: "#17a2b8", description: "Barking Up the Right Conversation!"  },
    { title: "Pawsitive Wellness", icon: "fas fa-heartbeat", path: "/coming-soon", color: "#301934", description: "Nurturing Health, One Tail Wag at a Time!"  },
    { title: "Paw Pals Community", icon: "fas fa-calendar-alt", path: "/coming-soon", color: "#007bff", description: "Together, Every Dog Has Its Day!"  },
    {  title: "Paw Puppy Peek", icon: "fas fa-dog", path: "/view-pups", color: "#6c757d", description: "Discover Your Forever Friend!" }
  ];


  const handleTileClick = (path) => {
    navigate(path);
  };
  const [imageSectionRef, imageSectionInView] = useInView({

    threshold: 0.1
  });
  const [videoSectionRef, videoSectionInView] = useInView({

    threshold: 0.1
  });
  const [carouselSectionRef, carouselSectionInView] = useInView({

    threshold: 0.1
  });
  const [containerRef, containerInView] = useInView({
    threshold: 0.1, // Adjust as needed
    // triggerOnce removed
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      }
    },
    exit: { opacity: 0, transition: { duration: 2 } }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 2,
      y: 0,
      transition: { duration: 2 } // Increase duration to 1 second
    }
  };

  const tileVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  return (
    <div>
<motion.div
      ref={containerRef}
      className="tile-container"
      variants={containerVariants}
      initial="hidden"
      animate={containerInView ? "visible" : "hidden"}
      exit="exit"
    >
          <div className="first-image-section mb-5">
          <div class="text-over-image">Little Paws Place!</div>
          </div>

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
    <motion.div
        ref={imageSectionRef}
        initial="hidden"
        animate={imageSectionInView ? "visible" : "hidden"}
        variants={sectionVariants}
      >
    <div className="full-height-section image-section">

        <div className="content">
          <h2>A Special Section</h2>
          <p>Explore more about our community and activities.</p>
          <div className="buttons">
          <a href='coming-soon' rel="noopener noreferrer"><button className="btn btn-primary">Learn More</button></a>
          <a href='coming-soon' rel="noopener noreferrer"> <button className="btn btn-secondary">Join Us</button></a>
          </div>
        </div>
      </div>
      </motion.div>
      <motion.div
        ref={videoSectionRef}
        initial="hidden"
        animate={videoSectionInView ? "visible" : "hidden"}
        variants={sectionVariants}
      >
      <div className="full-height-section another-section">
        <div className="video-container">
        <iframe  src="https://www.youtube.com/embed/tKb4vUPpQzo?si=7RcpyQeTmklAz8Ld" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
      </div>
      </motion.div>
      <motion.div
        ref={carouselSectionRef}
        initial="hidden"
        animate={carouselSectionInView ? "visible" : "hidden"}
        variants={sectionVariants}
      >
      <footer className="site-footer">
      <PetCarousel />
    </footer>
    </motion.div>
    </div>
  );
}

export default CustomJumbotron;
