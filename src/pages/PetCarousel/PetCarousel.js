// PetCarousel.js (minor updates to align with broader pet types)
import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import loadingImage from '../../assets/images/loading.gif';
import './PetCarousel.css';

function PetCarousel() {
  const [petfinderAnimals, setPetfinderAnimals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPetfinderAnimals();
  }, []);

  const fetchPetfinderAnimals = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://izaaugmn66.execute-api.us-east-1.amazonaws.com/default/getPetfinderToken');
      const data = await response.json();
      if (Array.isArray(data)) {
        setPetfinderAnimals(data);
      }
    } catch (err) {
      console.error('Error fetching Petfinder data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modern-carousel-wrapper">
      {isLoading ? (
        <div className="loading-wrapper">
          <img src={loadingImage} alt="Loading..." className="loading-image" />
        </div>
      ) : (
        <Carousel fade className="modern-carousel">
          {petfinderAnimals.map((animal) => (
            <Carousel.Item key={animal.id}>
              <div className="carousel-inner-content">
                <img
                  className="d-block w-100 pet-carousel-image"
                  src={animal.primary_photo_cropped?.large || '/no-dogs-placeholder.png'}
                  alt={animal.name}
                />
                <div className="carousel-overlay">
                  <h3 className="animal-name">{animal.name}</h3>
                  {animal.breeds?.primary && (
                    <p className="animal-meta">{animal.breeds.primary} • {animal.age}</p>
                  )}
                  {animal.url && (
                    <a href={animal.url} target="_blank" rel="noopener noreferrer">
                      <button className="btn btn-light btn-sm mt-2">Learn More</button>
                    </a>
                  )}
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </div>
  );
}

export default PetCarousel;
