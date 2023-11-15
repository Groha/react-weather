import { useRef } from 'react';

export default function WeatherHeader({currentCity, getCoordinatesByCity}) {
  const newCityRef = useRef(null)

  const handleClick = (e) => {
    e.preventDefault();
    getCoordinatesByCity(newCityRef.current.value)
  }

  return (
    <>
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
            onClick={handleClick}
          >
            Change city
          </button>
        </form>
      </div>
    </>
  );
}
