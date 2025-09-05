

import React, { useState, useEffect } from 'react';
import type { WidgetInstance, TemperatureUnit } from '../../types';

// --- Note Widget ---
interface NoteWidgetProps {
  widget: WidgetInstance;
  onUpdate: (widget: WidgetInstance) => void;
  isEditing: boolean;
}

export const NoteWidget: React.FC<NoteWidgetProps> = ({ widget, onUpdate, isEditing }) => {
  const [text, setText] = useState(widget.data?.text || '');

  useEffect(() => {
    setText(widget.data?.text || '');
  }, [widget.data?.text]);

  const handleBlur = () => {
    onUpdate({ ...widget, data: { ...widget.data, text } });
  };

  return (
    <div className={`w-full h-full bg-yellow-200 p-4 rounded-xl shadow-lg font-['Caveat'] text-2xl ${isEditing ? 'pointer-events-none' : ''}`}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        className="w-full h-full bg-transparent border-none resize-none outline-none text-gray-800"
        placeholder="Type here..."
      />
    </div>
  );
};


// --- Weather Widget ---
const WeatherIcon: React.FC<{ code: number | undefined }> = ({ code }) => {
    let icon = '☀️';
    if (code === undefined) return <span className="text-3xl">...</span>;
    if ([1, 2, 3].includes(code)) icon = '☁️';
    if (code >= 51 && code <= 67) icon = '🌧️';
    if (code >= 71 && code <= 77) icon = '❄️';
    if (code >= 80 && code <= 82) icon = '🌦️';
    if (code >= 95 && code <= 99) icon = '⛈️';
    return <span className="text-3xl">{icon}</span>;
};

interface WeatherWidgetProps {
    temperatureUnit: TemperatureUnit;
}

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({ temperatureUnit }) => {
  const [weather, setWeather] = useState<{ temp: number, code: number, city: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = (lat: number, lon: number) => {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&timezone=auto&temperature_unit=${temperatureUnit}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.current) {
            setWeather({ 
                temp: Math.round(data.current.temperature_2m), 
                code: data.current.weather_code,
                city: "Current Location"
            });
          } else {
              setError("Cannot fetch weather.");
          }
        })
        .catch(() => setError("Cannot fetch weather."));
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setError(null);
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        setError("Location access denied.");
      }
    );
  }, [temperatureUnit]);

  return (
    <div className="w-full h-full bg-white/60 backdrop-blur-md p-4 rounded-xl shadow-lg flex flex-col items-center justify-center text-center font-sans">
      {error ? (
        <div className="text-red-500 text-sm p-2">{error}</div>
      ) : weather ? (
        <>
            <div className="text-sm text-gray-700 font-medium">{weather.city}</div>
            <div className="my-1"><WeatherIcon code={weather.code} /></div>
            <div className="text-2xl font-bold text-gray-900">{weather.temp}{temperatureUnit === 'celsius' ? '°C' : '°F'}</div>
        </>
      ) : (
        <div className="text-gray-500">Loading...</div>
      )}
    </div>
  );
};