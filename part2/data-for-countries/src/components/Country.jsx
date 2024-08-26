import { useState, useEffect } from "react";
import axios from "axios";

const WEATHER_API_KEY = import.meta.env.VITE_WEATHER_KEY;

const Country = ({ country }) => {
  if (!country) return null;

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const unit = `units=metric`;
    const lat = `lat=${country.latlng[0]}`;
    const lon = `lon=${country.latlng[1]}`;
    const key = `appid=${WEATHER_API_KEY}`;
    const fullQ = `${unit}&${lat}&${lon}&${key}`;
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?${fullQ}`)
      .then(({ data }) => {
        console.log(
          "%cSetting the stat of country's weather...",
          "color: orange"
        );
        setWeather(data);
      })
      .catch((e) => console.log(`%c${e.message}`, "color: red"));
    console.log("Fetching weather data...", "color: orange");
  }, []);

  return (
    <div>
      <h1>{country.name.official}</h1>
      <p>
        capital <strong>{country.capital}</strong>
      </p>
      <p>
        area <strong>{country.area}</strong>
      </p>
      <h2 id="languages">languages:</h2>
      <ul aria-labelledby="languages">
        {Object.values(country.languages).map((lang) => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <p>
        <img
          src={country.flags.png}
          alt={`The flag of ${country.name.common}`}
        />
      </p>
      {weather && (
        <>
          <h2>{`Weather in ${country.capital}`}</h2>
          <p>{`temperature ${weather.main.temp} Celsius`}</p>
          <p>
            <img
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={`${weather.weather[0].description}`}
            />
          </p>
          <p>{`wind ${weather.wind.speed} m/s`}</p>
        </>
      )}
    </div>
  );
};

export default Country;
