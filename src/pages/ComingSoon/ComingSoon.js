import React, { useState, useEffect } from 'react';
import './ComingSoon.css'; // Make sure to import the CSS file
import { useNavigate } from 'react-router-dom';

function ComingSoon() {

  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // This will take the user back to the previous page
  };


  const calculateTimeLeft = () => {
    const difference = +new Date("2024-02-01") - +new Date(); // Set your target date here
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span key={interval}>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <div className="coming-soon-container">
      <h1>Coming Soon</h1>
      <p>We're working hard to bring you something amazing!</p>
      <div className="countdown">
        {timerComponents.length ? timerComponents : <span>Time's up!</span>}
      </div>
      <button className="back-button m-4" onClick={goBack}>
  <i className="fa fa-arrow-left"></i> Go Back
</button>
    </div>
  );
}

export default ComingSoon;
