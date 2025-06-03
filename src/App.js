import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WeatherInfo from './components/WeatherInfo';
import Forecast from './components/Forecast';
import BackgroundAnimation from './components/BackgroundAnimation';
import './components/Animation.css';
import tzLookup from 'tz-lookup';


function App() {
  const [data, setData] = useState({});
  const [forecast, setForecast] = useState([]);
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [now, setNow] = useState(null); 


  const weatherMain = data.weather && data.weather[0] ? data.weather[0].main : '';

  const isDaytime =
    data.sys && data.dt && data.sys.sunrise && data.sys.sunset
      ? data.dt >= data.sys.sunrise && data.dt < data.sys.sunset
      : true; 

  const getLocalTime = (dt, lat, lon) => {
    if (!dt || lat === undefined || lon === undefined) return '';
    try {
      const timeZone = tzLookup(lat, lon);
      const date = new Date(dt * 1000); 
      return new Intl.DateTimeFormat('ro-RO', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone,
      }).format(date);
    } catch (error) {
      console.error('Eroare la detectarea fusului orar', error);
      return '';
    }
  };

  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  const fetchWeatherByLocation = async (loc) => {
    if (!loc.trim()) return;
    setLoading(true);
    setErrorMsg('');

    const fetchAndSet = async (query) => {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`
      );
      console.log('Weather API data:', response.data);
      setData(response.data);
      await fetchForecastByCoords(response.data.coord.lat, response.data.coord.lon);
    };

    try {
      if (loc.includes(',')) {
        const [city, countryInput] = loc.split(',').map(s => s.trim());
        if (countryInput.length === 2) {
          await fetchAndSet(`${city},${countryInput.toUpperCase()}`);
        } else {
          try {
            const countryResponse = await axios.get(
              `https://restcountries.com/v3.1/name/${countryInput}`
            );
            const countryCode = countryResponse.data[0]?.cca2;
            if (countryCode) {
              await fetchAndSet(`${city},${countryCode}`);
            } else {
              throw new Error('No country code found');
            }
          } catch (countryErr) {
            setErrorMsg('Sorry, we could not find weather data for that country. Please check your input.');
          }
        }
      } else {
        try {
          await fetchAndSet(loc);
        } catch (cityErr) {
          try {
            const countryResponse = await axios.get(
              `https://restcountries.com/v3.1/name/${loc}`
            );
            const capital = countryResponse.data[0]?.capital?.[0];
            const countryCode = countryResponse.data[0]?.cca2;
            if (capital && countryCode) {
              await fetchAndSet(`${capital},${countryCode}`);
            } else {
              throw new Error('No capital or country code found');
            }
          } catch (countryErr) {
            setErrorMsg('Sorry, we could not find weather data for that location or country. Please check your input.');
          }
        }
      }
    } catch (error) {
      setErrorMsg('Sorry, we could not find weather data for your search. Please check your input.');
    } finally {
      setLoading(false);
    }
  };

  const fetchForecastByCoords = async (lat, lon) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      console.log('Forecast API data:', response.data); 
      const daily = response.data.list.filter(item => item.dt_txt.includes('12:00:00'));
      setForecast(daily);
    } catch (err) {
      console.error("Forecast fetch failed", err);
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
      );
      setData(response.data);
      fetchForecastByCoords(lat, lon);
    } catch (error) {
      alert('Could not fetch your location weather.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    if (event.key === 'Enter') {
      fetchWeatherByLocation(location);
      setLocation('');
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          fetchWeatherByCoords(latitude, longitude);
        },
        () => alert("Location access denied. Search manually.")
      );
    }
  }, []);

  useEffect(() => {
    if (data.dt && data.coord) {
      setNow(Math.floor(Date.now() / 1000)); 
      const interval = setInterval(() => {
        setNow(Math.floor(Date.now() / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [data.dt, data.coord]);


  return (
    <div className={`app ${isDaytime ? 'sky-day' : 'sky-night'}`}>
      <BackgroundAnimation weather={weatherMain} isDaytime={isDaytime} />


      <div className="search">
        {errorMsg && (
          <div className="error-message" style={{ color: '#d9534f', marginBottom: '8px' }}>
            {errorMsg}
          </div>
        )}
        <div style={{ position: "relative" }}>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Enter location"
            disabled={loading}
            style={loading ? { background: "rgba(255,255,255,0.35)", cursor: "not-allowed" } : {}}
          />
          {loading && (
            <div
              className="loader"
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%) scale(0.7)",
                width: 28,
                height: 28,
                borderWidth: 3,
              }}
            />
          )}
        </div>
      </div>
          
      <div className="container">
        <div className="top">
          <div className="location">
            <p>
              {data.name}
              {data.sys && data.sys.country ? `, ${data.sys.country}` : ''}
            </p>
          </div>
          <div className="temp">
            {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
          </div>
          <div className="description">
            {data.weather && data.weather[0] ? (
              <p className="bold">{data.weather[0].main}</p>
            ) : null}
          </div>
        </div>

       
        {data.dt && data.coord && (
          <div className="local-time">
            <span role="img" aria-label="clock" style={{marginRight: 8}}>🕒</span>
            Local hour: {getLocalTime(now || data.dt, data.coord.lat, data.coord.lon)}
          </div>
        )}

        {loading && <div className="loader"></div>}
        {!loading && data.main && <WeatherInfo data={data} />}
        {!loading && forecast.length > 0 && <Forecast forecast={forecast} />}
      </div>
      

    </div>
    
  );
}

export default App;
