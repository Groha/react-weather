import { useState, useEffect, useRef } from "react";
import axios from "axios";
import weatherIconsData from "./assets/weathercode-icons/index.json";
import windSpeedClasses from "./assets/windspeed-colors/index.json";

import CurrentWeather from './components/CurrentWeather'

import "./App.css";

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const [currentCity, setCurrentCity] = useState("Munich");
  const [latitude, setLatitude] = useState("48.1549107");
  const [longitude, setLongitude] = useState("11.5418357");

  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,rain,showers,snowfall,weathercode,surface_pressure,windspeed_10m&forecast_days=4`
      );

      if (response.status === 200) {
        console.log(response.data);
        setWeatherData(response.data);
      } else {
        console.error("Ошибка при получении данных о погоде");
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };

  useEffect(() => {
    fetchWeatherData();
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

  const newCityRef = useRef(null)
  const getNewCity = async (e) => {
    e.preventDefault();
    const newCity = newCityRef.current.value;
    console.log(newCity)
  
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${newCity}`
      );
  
      if (response.status === 200 && response.data.length > 0) {
        const newLatitude = response.data[0].lat;
        const newLongitude = response.data[0].lon;
  
        setCurrentCity(newCity);
        setLatitude(newLatitude);
        setLongitude(newLongitude);

        fetchWeatherData();
      } else {
        console.error("Город не найден или произошла ошибка при получении координат.");
      }
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    }
  };

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
  const nextHoursWindSpeed = getNextHoursData(false, "windspeed_10m");
  const nextWeatherCode = getNextHoursData(false, "weathercode");
  const nextWeatherIcons = getNextHoursWeatherIcons(nextWeatherCode, nextHoursTemperature.map(data => data.hour));

  
  
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

  const currentData = {
    currentTemperature: weatherData?.hourly?.temperature_2m[currentHour],
    currentWindSpeed: weatherData?.hourly?.windspeed_10m[currentHour],
    currentPressure: weatherData?.hourly?.surface_pressure[currentHour],
    currentPrecipitationProbability: weatherData?.hourly?.precipitation_probability[currentHour],
    weatherIconUrl: weatherIconUrl,
    weatherCondition: weatherCondition
  }
  
  const threeDaysTemperatureData = getWeatherDataForNextDays(true, weatherData, "temperature_2m", 3);
  const threeDaysWindSpeedData = getWeatherDataForNextDays(false, weatherData, "windspeed_10m", 3);
  const threeDaysWeatherCode = getWeatherDataForNextDays(false, weatherData, "weathercode", 3);
  const threeDaysWeatherIcons = threeDaysWeatherCode.map((codes) => getWeatherIconsForDay(codes));

  const [isWeatherBlockVisible, setWeatherBlockVisibility] = useState(true);
  const changeWeatherBlockVisibility = () => {
    setWeatherBlockVisibility(!isWeatherBlockVisible)
  }

  return (
    <>
      {weatherData && weatherData.hourly ? (
        <div className="w-[80%] mx-auto p-5 rounded border">
          <div className="flex justify-between mb-5">
            <span className="text-2xl font-semibold">{currentCity}</span>
            <form>
              <input
                className="border outline-none mr-5 py-1 px-3"
                type="text"
                placeholder="Enter your city..."
                ref={newCityRef}
              />
              <button
                className="py-1 px-3 bg-blue-100 border border-blue-100 hover:border-blue-300 rounded"
                onClick={getNewCity}
              >
                Change city
              </button>
            </form>
          </div>
          <div className={`grid-cols-3 ${isWeatherBlockVisible ? 'grid' : 'hidden'}`}>
            <CurrentWeather currentData={currentData} />

            <div className="col-span-2 pl-3 py-3">
              <div className="grid grid-cols-5 mb-5">
                {nextHoursTemperature.map(({ hour, value }, index) => (
                  <div className="grid" key={hour}>
                    <span>
                      {hour} <span className="align-top text-[10px]">00</span>
                    </span>
                    <img
                      src={nextWeatherIcons[index]}
                      alt=""
                      className="w-[60px] h-[60px] mx-auto"
                    />
                    <span>{value}°С</span>
                  </div>
                ))}
              </div>
              <span className="font-semibold">Wind speed, km/h</span>
              <div className="grid grid-cols-5 mt-1">
                {nextHoursWindSpeed.map((windSpeed, index) => (
                  <span key={index} className={`mx-2 first:ml-0 last:mr-0 ${getWindSpeedClass(windSpeed)}`}>{windSpeed}</span>
                ))}
              </div>
            </div>
          </div>
          <div className={`grid-cols-3 mt-4 ${isWeatherBlockVisible ? 'hidden' : 'grid'}`}>
            {[...Array(3)].map((_, dayIndex) => (
              <div className="px-3 first:pl-0 last:pr-0 pb-3 border-r last:border-r-0" key={dayIndex}>
                <p className="mb-4 font-semibold">{(() => {
                    const today = new Date();
                    const actualDate = new Date(today);
                    actualDate.setDate(new Date().getDate() + 1 + dayIndex);
                    return actualDate.toLocaleString("en-EN", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                    }).replace(" at", " ");
                  })()}</p>
                <div className="grid grid-cols-4 mb-5">
                  {threeDaysTemperatureData[dayIndex].map(({ hour, value }, index) => (
                    <div className="grid" key={hour}>
                      <span>
                        {hour} <span className="align-top text-[10px]">00</span>
                      </span>
                      <img
                        src={threeDaysWeatherIcons[dayIndex][index]}
                        alt=""
                        className="w-[60px] h-[60px] mx-auto"
                      />
                      <span>{value}°С</span>
                    </div>
                  ))}
                </div>
                <span className="font-semibold">Wind speed, km/h</span>
                <div className="grid grid-cols-4 mt-1">
                  {threeDaysWindSpeedData[dayIndex].map((windSpeed, index) => (
                    <span key={index} className={`mx-2 first:ml-0 last:mr-0 ${getWindSpeedClass(windSpeed)}`}>{windSpeed}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex justify-between">
            <a href="#" className={`mx-10 first:ml-0 last:mr-0 w-full px-10 py-1 uppercase rounded border border-violet-200 hover:border-violet-400 transition-colors ${isWeatherBlockVisible ? 'pointer-events-none bg-violet-100' : 'pointer-events-auto bg-violet-200'}`} onClick={changeWeatherBlockVisibility}>today</a>
            <a href="#" className={`mx-10 first:ml-0 last:mr-0 w-full px-10 py-1 uppercase rounded border border-violet-200 hover:border-violet-400 transition-colors ${isWeatherBlockVisible ? 'pointer-events-auto bg-violet-200' : 'pointer-events-none bg-violet-100'}`} onClick={changeWeatherBlockVisibility}>3 days</a>
          </div>
        </div>
      ) : (
        "Загрузка данных..."
      )}
    </>
  );
}

export default App;
