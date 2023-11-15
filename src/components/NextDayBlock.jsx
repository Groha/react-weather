export default function ComponentName({dayIndex, threeDaysData, getWindSpeedClass}) {
  return (
    <>
      <div className="px-3 first:pl-0 last:pr-0 pb-3 border-r last:border-r-0">
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
          {threeDaysData.threeDaysTemperatureData[dayIndex].map(({ hour, value }, index) => (
            <div className="grid" key={hour}>
              <span>
                {hour} <span className="align-top text-[10px]">00</span>
              </span>
              <img
                src={threeDaysData.threeDaysWeatherIcons[dayIndex][index]}
                alt=""
                className="w-[60px] h-[60px] mx-auto"
              />
              <span>{value}°С</span>
            </div>
          ))}
        </div>
        <span className="font-semibold">Wind speed, km/h</span>
        <div className="grid grid-cols-4 mt-1">
          {threeDaysData.threeDaysWindSpeedData[dayIndex].map((windSpeed, index) => (
            <span key={index} className={`mx-2 first:ml-0 last:mr-0 ${getWindSpeedClass(windSpeed)}`}>{windSpeed}</span>
          ))}
        </div>
      </div>
    </>
  );
}
