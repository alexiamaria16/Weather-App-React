import React from 'react';

function Forecast({ forecast }) {
  return (
    <div className="forecast">
      <h2>5-Day Forecast</h2>
      <div className="forecast-cards">
        {forecast.map((item, index) => (
          <div className="forecast-card" key={index}>
            <p>{new Date(item.dt_txt).toLocaleDateString(undefined, { weekday: 'short' })}</p>
            <img
              src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
              alt={item.weather[0].description}
            />
            <p>{item.main.temp.toFixed()}°C</p>
            <p className="desc">{item.weather[0].main}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Forecast;
