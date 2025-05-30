import React, {useState} from 'react';
import axios from 'axios'


function App() {
  
  const [data,setData] = useState({});
  const [location, setLocation] = useState('');
  
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  const url=`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`

  const searchLocation = (event) => {
    
    if(event.key ==='Enter'){
      axios.get(url).then((response) => {
        setData(response.data)
        console.log(response.data)
      })
      setLocation('')
    }
  }

  return(
    <div className='app'>

      <div className='search'>
        <input type="text" 
        value={location} 
        onChange={event => setLocation(event.target.value)} 
        placeholder='Enter location' 
        onKeyPress={searchLocation}/>
      </div>

    <div className='container'>

      <div className='top'>
        <div className='location'>
          <p>{data.name}</p>
        </div>
        <div className='temp'>
          {data.main ? <h1>{data.main.temp.toFixed()}°C</h1>:null}
        </div>
        <div className='description'>
        {data.main ? <p className='bold'>{data.weather[0].main}</p>:null}
        </div>
      </div>


    {data.main != undefined &&
    
      <div className='bottom'>
        <div className='feels'>
          {data.main ? <p className='bold'>{data.main.feels_like.toFixed()}°C</p>:null}
          <p>Feels like</p>
        </div>
        <div className='humidity'>
          {data.main ? <p className='bold'>{data.main.humidity}%</p>:null}
          <p>Humidity</p>
        </div>
        <div className='wind'>
          {data.main ? <p className='bold'>{data.wind.speed}MPH</p>:null}
          <p>Wind speed</p>
        </div>
      </div>
    }
    </div>
    </div>
  )

}

export default App;
