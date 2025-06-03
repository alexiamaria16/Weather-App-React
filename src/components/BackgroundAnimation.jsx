import React, { useEffect, useState } from 'react';

function BackgroundAnimation({ weather, isDaytime }) {
  const [shootingStars, setShootingStars] = useState([]);

  useEffect(() => {
    if (weather === 'Clear' && !isDaytime) {
      const interval = setInterval(() => {
        const starId = Date.now();
        const left = Math.random() * window.innerWidth;
        const top = Math.random() * (window.innerHeight / 2);

        const newStar = { id: starId, left, top };
        setShootingStars((prev) => [...prev, newStar]);

        setTimeout(() => {
          setShootingStars((prev) => prev.filter((s) => s.id !== starId));
        }, 1200); 
      }, 5000 + Math.random() * 5000); 

      return () => clearInterval(interval);
    }
  }, [weather, isDaytime]);

  let weatherClass = '';
  if (weather === 'Clouds') {
    weatherClass = 'cloudy';
  } else if (isDaytime) {
    switch (weather) {
      case 'Rain': weatherClass = 'rain'; break;
      case 'Snow': weatherClass = 'snow'; break;
      case 'Clear': weatherClass = 'sunny'; break;
      default: weatherClass = '';
    }
  } 
  else {
        switch (weather) {
    case 'Rain': weatherClass = 'rain'; break;
    case 'Snow': weatherClass = 'snow'; break;
    case 'Clear': weatherClass = 'stars'; break;
    default: weatherClass = ''; }
  }

  return (
    <>
      <div className={`weather-animation ${weatherClass}`} />
      {!isDaytime && weather === 'Clear' && (
        <div className="weather-animation shooting-stars">
          {shootingStars.map((s) => (
            <div
              key={s.id}
              className="shooting-star"
              style={{ top: s.top, left: s.left }}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default BackgroundAnimation;
