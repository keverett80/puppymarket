import React, { useEffect, useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import loadingImage from '../../assets/images/loading.gif'

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
      console.log(response)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Data is not an array');
      }
      setPetfinderAnimals(data);
    } catch (err) {
      console.error('Error fetching Petfinder data:', err);
      setPetfinderAnimals([]); // Reset to empty array on error
    } finally{
      setIsLoading(false);
    }
  };


  return (
    <div>
    {isLoading ? (
         <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
         <img src={loadingImage} alt="Loading..." />
       </div>
    ) : (
    <Carousel>
      {petfinderAnimals.map((animal) => (
        <Carousel.Item key={animal.id}>
          <img
            className="d-block w-100"
            src={animal.primary_photo_cropped?.large}
            alt={animal.name}
          />
          <Carousel.Caption>
            <h3>{animal.name}</h3>
            {/* Check for null before rendering breeds and age */}
            {animal.breeds?.primary && <p>{animal.breeds.primary} - {animal.age}</p>}
            {/* Render button only if animal.url is available */}
            {animal.url && (
              <a href={animal.url} target="_blank" rel="noopener noreferrer">
                <button className="btn btn-primary">Learn More</button>
              </a>
            )}
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
     )}
     </div>
  );
}

export default PetCarousel;
