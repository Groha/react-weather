import React from 'react';

export default function CurrentWeather({currentData}) {
  return (
    <>
      <div className="border-r pr-3 py-3">
        <p className="text-left font-semibold">
          {new Date()
            .toLocaleString("en-EN", {
              weekday: "short",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })
            .replace(" at", " ")}
        </p>
        <div className="flex items-center mt-7">
          <span>{currentData.currentTemperature}°С</span>
          <img
            src={currentData.weatherIconUrl}
            alt=""
            className="w-[60px] h-[60px] mx-auto"
          />
          <span>{currentData.weatherCondition}</span>
        </div>
        <p className="flex justify-between relative before:block before:w-full before:h-[1px] before:border-b before:border-dotted before:absolute before:bottom-[5px] before:z-[-1]">
          <span className="bg-white">Wind</span>
          <span className="bg-white">{currentData.currentWindSpeed} km/h</span>
        </p>
        <p className="flex justify-between relative before:block before:w-full before:h-[1px] before:border-b before:border-dotted before:absolute before:bottom-[5px] before:z-[-1]">
          <span className="bg-white">Pressure</span>
          <span className="bg-white">{currentData.currentPressure} hPa</span>
        </p>
        <p className="flex justify-between relative before:block before:w-full before:h-[1px] before:border-b before:border-dotted before:absolute before:bottom-[5px] before:z-[-1]">
          <span className="bg-white">Probability precipitation</span>
          <span className="bg-white">{currentData.currentPrecipitationProbability}%</span>
        </p>
      </div>
    </>
  );
}
