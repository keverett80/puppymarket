import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';


function PetCarousel() {
  const [petfinderAnimals, setPetfinderAnimals] = useState([]);

  useEffect(() => {
    fetchPetfinderAnimals();
  }, []);

  const fetchPetfinderAnimals = async () => {
    try {
      const response = await fetch('https://izaaugmn66.execute-api.us-east-1.amazonaws.com/default/getPetfinderToken');
      const data = await response.json();
      setPetfinderAnimals(data);
    } catch (err) {
      console.error('Error fetching Petfinder data:', err);
    }
  };

  return (
    <Carousel>
      {petfinderAnimals.map((animal) => (
        <Carousel.Item key={animal.id}>
          <img
            className="d-block w-100"
            src={animal.primary_photo_cropped.large}
            alt={animal.name}
          />
          <Carousel.Caption>
            <h3>{animal.name}</h3>
            <p>{animal.breeds.primary} - {animal.age}</p>
             <a href={animal.url} target="_blank" rel="noopener noreferrer"><button className="btn btn-primary">Learn More</button></a>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default PetCarousel;
