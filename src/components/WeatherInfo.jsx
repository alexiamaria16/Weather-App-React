import React from 'react';

function WeatherInfo({ data }) {
  return (
    <div className="bottom">
      <div className="feels">
        <p className="bold">{data.main.feels_like.toFixed()}°C</p>
        <p>Feels like</p>
      </div>
      <div className="humidity">
        <p className="bold">{data.main.humidity}%</p>
        <p>Humidity</p>
      </div>
      <div className="wind">
        <p className="bold">{data.wind.speed} MPH</p>
        <p>Wind speed</p>
      </div>
    </div>
  );
}

export default WeatherInfo;
