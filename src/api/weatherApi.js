import axios from "axios";

export const fetchWeatherData = async (latitude, longitude, setWeatherData) => {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation_probability,rain,showers,snowfall,weathercode,surface_pressure,windspeed_10m&forecast_days=4`;
    const response = await axios.get(url);

    if (response.status === 200) {
      setWeatherData(response.data);
    } else {
      console.error("Error fetching weather data");
    }
  } catch (error) {
    console.error("Error sending request:", error);
  }
};