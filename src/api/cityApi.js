import axios from "axios";

export const getCoordinatesByCity = async (newCity, setCurrentCity, setLatitude, setLongitude, fetchWeatherData, setWeatherData) => {
  try {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${newCity}`);

    if (response.status === 200 && response.data.length > 0) {
      const { lat, lon } = response.data[0];

      setCurrentCity(newCity);
      setLatitude(lat);
      setLongitude(lon);

      await fetchWeatherData(lat, lon, setWeatherData);
    } else {
      console.error("Город не найден или произошла ошибка при получении координат.");
    }
  } catch (error) {
    console.error("Ошибка при отправке запроса:", error);
  }
};