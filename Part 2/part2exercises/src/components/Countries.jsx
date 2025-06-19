import { useState, useEffect } from 'react';
import {Button } from "./UI.jsx";
import axios from 'axios';

const Item = ({ name }) => <li>{name}</li>;

const List = ({ arr }) => {
  return (
    <ul>
      {arr.map((item, i) => <Item key={i} name={item} />)}
    </ul>
  );
};

const CountriesList = ({ arr, setSearch }) => {
  const showMore = (country) => {
    setSearch(country);
  };
  return (
    <ul>
      {arr.map((item, i) => (
        <li 
          style={{ 
            width: "100%", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center" 
          }} 
          key={i}
        >
          • {item}
          <Button label={"Show"} onClick={() => showMore(item)} />
        </li>
      ))}
    </ul>
  );
};

const Country = ({ country }) => {
  const [weather, setWeather] = useState({});
  const [lat, lng] = country.capitalInfo.latlng;
  const key = "20f2a1163e308c7d969f5890fb125a52";

  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']");
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${key}&units=metric`)
      .then(res => {
        const icon = `https://openweathermap.org/img/wn/${res.data.weather[0].icon}@2x.png`;
        setWeather({
          icon: icon,
          wind: res.data.wind.speed,
          temp: res.data.main.temp
        });
        link.href = icon;
        document.title = `${res.data.weather[0].description} in ${country.capital[0]}`;
      })
      .catch(err => console.error(err.message));
  }, [lat, lng, country.capital]);

  return (
    <>
      <h2>{country.name.common}</h2>
      <p>&nbsp;Capital: {country.capital[0]}</p>
      <p>&nbsp;Area: {country.area}km²</p>

      <h3>Languages:</h3>
      <List arr={Object.values(country.languages)} />
      <img 
        style={{ width: 150 }} 
        src={country.flags.svg} 
        alt={country.flags.alt || "Country flag"} 
      />
      
      <h3>Weather in {country.capital[0]}</h3>
      <div style={{ display: "flex", alignItems: "center" }}>
        <>Temperature: {weather.temp}°C / Wind: {weather.wind}m/s</>
        {weather.icon && <img style={{ width: 50 }} src={weather.icon} alt="Weather icon" />}
      </div>
    </>
  );
};

const Countries = ({ countriesArr, setSearch }) => {
  if (countriesArr.length === 0) return null;
  
  if (countriesArr.length > 1) {
    return (
      <CountriesList 
        setSearch={setSearch} 
        arr={countriesArr.map(country => country.name.common)} 
      />
    );
  }

  return <Country country={countriesArr[0]} />;
};

export default Countries;