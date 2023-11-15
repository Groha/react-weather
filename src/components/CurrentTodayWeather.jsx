export default function CurrentTodayWeather({currentTodayData, getWindSpeedClass}) {
  return (
    <>
      <div className="col-span-2 pl-3 py-3">
        <div className="grid grid-cols-5 mb-5">
          {currentTodayData.nextHoursTemperature.map(({ hour, value }, index) => (
            <div className="grid" key={hour}>
              <span>
                {hour} <span className="align-top text-[10px]">00</span>
              </span>
              <img
                src={currentTodayData.nextWeatherIcons[index]}
                alt=""
                className="w-[60px] h-[60px] mx-auto"
              />
              <span>{value}°С</span>
            </div>
          ))}
        </div>
        <span className="font-semibold">Wind speed, km/h</span>
        <div className="grid grid-cols-5 mt-1">
          {currentTodayData.nextHoursWindSpeed.map((windSpeed, index) => (
            <span key={index} className={`mx-2 first:ml-0 last:mr-0 ${getWindSpeedClass(windSpeed)}`}>{windSpeed}</span>
          ))}
        </div>
      </div>
    </>
  );
}
