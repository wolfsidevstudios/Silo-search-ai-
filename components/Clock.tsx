import React, { useState, useEffect } from 'react';
import type { ClockSettings } from '../types';

// A simple weather icon component based on WMO codes
const WeatherIcon: React.FC<{ code: number | undefined }> = ({ code }) => {
    let icon = '☀️'; // Default: clear sky
    if (code === undefined) return null;
    if ([1, 2, 3].includes(code)) icon = '☁️'; // Mainly clear, partly cloudy, and overcast
    if (code >= 51 && code <= 67) icon = '🌧️'; // Drizzle, Rain
    if (code >= 71 && code <= 77) icon = '❄️'; // Snow
    if (code >= 80 && code <= 82) icon = '🌦️'; // Rain showers
    if (code >= 95 && code <= 99) icon = '⛈️'; // Thunderstorm
    return <span className="text-xl">{icon}</span>;
};

const themes: { [key in ClockSettings['theme']]: { dark: string; light: string } } = {
  classic: { dark: 'text-[#006A4E]', light: 'text-[#7FFFD4]' },
  mint: { dark: 'text-emerald-700', light: 'text-green-300' },
  peach: { dark: 'text-orange-600', light: 'text-amber-300' },
  mono: { dark: 'text-black', light: 'text-gray-400' },
};

interface ClockProps {
  settings: ClockSettings;
}

export const Clock: React.FC<ClockProps> = ({ settings }) => {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<{ temp: number, code: number } | null>(null);

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);
  
  useEffect(() => {
    const fetchWeather = (lat: number, lon: number) => {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`)
        .then(res => res.json())
        .then(data => {
          if (data && data.current) {
            setWeather({ temp: Math.round(data.current.temperature_2m), code: data.current.weather_code });
          }
        })
        .catch(console.error);
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.warn("Could not get location for weather:", error.message);
      }
    );
  }, []);

  const hours = time.getHours().toString().padStart(2, '0');
  const minutes = time.getMinutes().toString().padStart(2, '0');

  const dateString = time.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const colorClasses = themes[settings.theme] || themes.classic;
  
  const digitColors = [colorClasses.dark, colorClasses.light, colorClasses.light, colorClasses.dark];

  const horizontalClock = (
    <div className="flex items-center clock-font">
      <span className={`${digitColors[0]} clock-digit`}>{hours[0]}</span>
      <span className={`${digitColors[1]} clock-digit`}>{hours[1]}</span>
      <span className={`${colorClasses.dark} clock-digit mx-[-0.1em] self-start mt-[0.2em] text-8xl`}>:</span>
      <span className={`${digitColors[2]} clock-digit`}>{minutes[0]}</span>
      <span className={`${digitColors[3]} clock-digit`}>{minutes[1]}</span>
    </div>
  );

  const stackedClock = (
     <div className="flex flex-col items-center clock-font leading-[0.8]">
      <div className="flex">
        <span className={`${digitColors[0]} clock-digit`}>{hours[0]}</span>
        <span className={`${digitColors[1]} clock-digit`}>{hours[1]}</span>
      </div>
      <div className="flex">
        <span className={`${digitColors[2]} clock-digit`}>{minutes[0]}</span>
        <span className={`${digitColors[3]} clock-digit`}>{minutes[1]}</span>
      </div>
    </div>
  );


  return (
    <div className="flex flex-col items-center justify-center">
      {settings.style === 'stacked' ? stackedClock : horizontalClock}
      <div className="flex items-center space-x-4 mt-2 text-xl font-medium text-gray-700 date-weather-font">
        <span>{dateString}</span>
        {weather && (
          <div className="flex items-center space-x-2">
            <WeatherIcon code={weather.code} />
            <span>{weather.temp}°C</span>
          </div>
        )}
      </div>
    </div>
  );
};