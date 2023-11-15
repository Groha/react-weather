import { useState, useEffect } from "react";

import weatherIconsData from "./assets/weathercode-icons/index.json";
import windSpeedClasses from "./assets/windspeed-colors/index.json";

import CurrentTimeWeather from './components/CurrentTimeWeather'
import CurrentTodayWeather from './components/CurrentTodayWeather'
import NextDayBlock from './components/NextDayBlock'
import WeatherHeader from "./components/WeatherHeader";
import PurpleButtton from './components/buttons/PurpleButton'

import { fetchWeatherData } from "./api/weatherApi";
import { getCoordinatesByCity } from "./api/cityApi";

import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentCity, setCurrentCity] = useState("Munich");
  const [latitude, setLatitude] = useState("48.1549107");
  const [longitude, setLongitude] = useState("11.5418357");

  useEffect(() => {
    fetchWeatherData(latitude, longitude, setWeatherData);
    setCurrentHour(new Date().getHours());
  }, [latitude, longitude]);

  const getNextHoursData = (data, fieldName) => {
    if (weatherData && weatherData.hourly && weatherData.hourly[fieldName]) {
      const currentHour = new Date().getHours();
      const nextData = [];
  
      for (let i = 0; i < 5; i++) {
        const hour = (currentHour + i) % 24;
        if (hour in weatherData.hourly[fieldName]) {
          nextData.push(
            data
              ? { hour, value: weatherData.hourly[fieldName][hour] }
              : weatherData.hourly[fieldName][hour]
          );
        }
      }
  
      return nextData;
    }
  
    return [];
  };

  const setNewCity = (newCity) => {
    getCoordinatesByCity(newCity, setCurrentCity, setLatitude, setLongitude, fetchWeatherData, setWeatherData)
  }

  const getNextHoursWeatherIcons = (weatherCodes, hours) => {
    return weatherCodes.map((code, index) => {
      const weatherInfo = weatherIconsData[code];
      let weatherIconUrl;
    
      const currentHour = hours[index];
    
      if (currentHour < 5 || currentHour > 18) {
        weatherIconUrl = weatherInfo?.night?.image;
      } else {
        weatherIconUrl = weatherInfo?.day?.image;
      }
    
      return weatherIconUrl;
    });
  };

  const getWindSpeedClass = (windSpeed) => {
    
    const windSpeedNumber = Math.round(parseFloat(windSpeed));
    
    for (const key in windSpeedClasses) {
      const [min, max] = key.split("—").map(Number);
      if (max) {
        if (windSpeedNumber >= min && windSpeedNumber <= max) {
          return windSpeedClasses[key];
        }
      } else if (windSpeedNumber >= min) {
        return windSpeedClasses[key];
      }
    }

    return "";
  };

  const nextHoursTemperature = getNextHoursData(true, "temperature_2m");
  const nextWeatherCode = getNextHoursData(false, "weathercode");
  
  const weatherCode = weatherData?.hourly?.weathercode[currentHour];
  const weatherInfo = weatherIconsData[weatherCode];
  
  let weatherIconUrl, weatherCondition;
  if(currentHour < 5 || currentHour > 18) {
    weatherIconUrl = weatherInfo?.night?.image;
    weatherCondition = weatherInfo?.night?.description;
  } else {
    weatherIconUrl = weatherInfo?.day?.image;
    weatherCondition = weatherInfo?.day?.description;
  }

  const getWeatherDataForNextDays = (data, weatherData, fieldName, numDays) => {
    if (
      weatherData &&
      weatherData.hourly &&
      weatherData.hourly[fieldName]
    ) {
      const daysData = [];
  
      for (let day = 1; day <= numDays; day++) {
        const dayData = [];
        for (let i = 0; i < 4; i++) {
          const hour = i * 6;
          const index = day * 24 + hour;
          if (index in weatherData.hourly[fieldName]) {
            
            dayData.push(
              data
              ? { hour, value: weatherData.hourly[fieldName][index] }
              : weatherData.hourly[fieldName][index]
            );
          }
        }
        daysData.push(dayData);
      }
  
      return daysData;
    }
  
    return [];
  };

  const getWeatherIconsForDay = (weatherCodes) => {
    return weatherCodes.map((code, index) => {
      const weatherInfo = weatherIconsData[code];
      const isNight = index === 0 || index === weatherCodes.length - 1;
      return isNight ? weatherInfo?.night?.image : weatherInfo?.day?.image;
    });
  };

  const currentTimeData = {
    currentTemperature: weatherData?.hourly?.temperature_2m[currentHour],
    currentWindSpeed: weatherData?.hourly?.windspeed_10m[currentHour],
    currentPressure: weatherData?.hourly?.surface_pressure[currentHour],
    currentPrecipitationProbability: weatherData?.hourly?.precipitation_probability[currentHour],
    weatherIconUrl: weatherIconUrl,
    weatherCondition: weatherCondition
  }

  const currentTodayData = {
    nextHoursTemperature: nextHoursTemperature,
    nextHoursWindSpeed: getNextHoursData(false, "windspeed_10m"),
    nextWeatherIcons: getNextHoursWeatherIcons(nextWeatherCode, nextHoursTemperature.map(data => data.hour))
  }

  const threeDaysWeatherCode = getWeatherDataForNextDays(false, weatherData, "weathercode", 3);
  const threeDaysData = {
    threeDaysTemperatureData: getWeatherDataForNextDays(true, weatherData, "temperature_2m", 3),
    threeDaysWindSpeedData: getWeatherDataForNextDays(false, weatherData, "windspeed_10m", 3),
    threeDaysWeatherIcons: threeDaysWeatherCode.map((codes) => getWeatherIconsForDay(codes))
  }

  const [isWeatherBlockVisible, setWeatherBlockVisibility] = useState(true);
  const changeWeatherBlockVisibility = () => {
    setWeatherBlockVisibility(!isWeatherBlockVisible)
  }

  return (
    <>
      {weatherData && weatherData.hourly ? (
        <div className="w-[80%] mx-auto p-5 rounded border">
          <WeatherHeader currentCity={currentCity} getCoordinatesByCity={setNewCity} />
          <div className={`grid-cols-3 ${isWeatherBlockVisible ? 'grid' : 'hidden'}`}>
            <CurrentTimeWeather currentTimeData={currentTimeData} />
            <CurrentTodayWeather currentTodayData={currentTodayData} getWindSpeedClass={getWindSpeedClass} />
          </div>
          <div className={`grid-cols-3 mt-4 ${isWeatherBlockVisible ? 'hidden' : 'grid'}`}>
            {[...Array(3)].map((_, dayIndex) => (
              <div key={dayIndex}>
                <NextDayBlock dayIndex={dayIndex} threeDaysData={threeDaysData} getWindSpeedClass={getWindSpeedClass} />
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between">
            <PurpleButtton isWeatherBlockVisible={!isWeatherBlockVisible} changeWeatherBlockVisibility={changeWeatherBlockVisibility}>today</PurpleButtton>
            <PurpleButtton isWeatherBlockVisible={isWeatherBlockVisible} changeWeatherBlockVisibility={changeWeatherBlockVisibility}>3 days</PurpleButtton>
          </div>
        </div>
      ) : (
        "Загрузка данных..."
      )}
    </>
  );
}

export default App;
