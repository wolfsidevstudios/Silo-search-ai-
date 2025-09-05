import React, { useState, useEffect } from 'react';
import type { ClockSettings, TemperatureUnit } from '../types';

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
  ocean: { dark: 'text-blue-800', light: 'text-sky-400' },
  sunset: { dark: 'text-purple-800', light: 'text-orange-400' },
  forest: { dark: 'text-green-900', light: 'text-lime-500' },
  neon: { dark: 'text-pink-500', light: 'text-cyan-300' },
  candy: { dark: 'text-red-500', light: 'text-yellow-300' },
  'liquid-glass': { dark: 'text-white/90', light: 'text-white/70' },
  espresso: { dark: 'text-[#4a2c2a]', light: 'text-[#f5e8d7]' },
  cherry: { dark: 'text-[#b24a69]', light: 'text-[#ffd1e2]' },
  lavender: { dark: 'text-[#6a5acd]', light: 'text-[#e6e6fa]' },
  gold: { dark: 'text-[#b1740f]', light: 'text-[#fde488]' },
  ruby: { dark: 'text-[#8b0000]', light: 'text-[#ffc0cb]' },
  sapphire: { dark: 'text-[#0f52ba]', light: 'text-[#add8e6]' },
  emerald: { dark: 'text-[#006400]', light: 'text-[#98ff98]' },
  graphite: { dark: 'text-[#36454f]', light: 'text-[#d3d3d3]' },
  coral: { dark: 'text-[#ff4500]', light: 'text-[#ffdab9]' },
  sky: { dark: 'text-[#55a0d3]', light: 'text-[#c6f1ff]' },
};

const fontClasses: { [key in ClockSettings['font']]: string } = {
  fredoka: 'clock-font-fredoka',
  serif: 'clock-font-serif',
  mono: 'clock-font-mono',
  pacifico: 'clock-font-pacifico',
  bungee: 'clock-font-bungee',
  'press-start': 'clock-font-press-start',
  caveat: 'clock-font-caveat',
  lobster: 'clock-font-lobster',
  anton: 'clock-font-anton',
  oswald: 'clock-font-oswald',
  playfair: 'clock-font-playfair',
  orbitron: 'clock-font-orbitron',
  vt323: 'clock-font-vt323',
  bebas: 'clock-font-bebas',
  dancing: 'clock-font-dancing',
  satisfy: 'clock-font-satisfy',
  elite: 'clock-font-elite',
};

const animationClasses: { [key in ClockSettings['animation']]: string } = {
    none: '',
    pulse: 'clock-anim-pulse',
    float: 'clock-anim-float',
}


interface ClockProps {
  settings: ClockSettings;
  temperatureUnit: TemperatureUnit;
}

export const Clock: React.FC<ClockProps> = ({ settings, temperatureUnit }) => {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState<{ temp: number, code: number } | null>(null);

  useEffect(() => {
    const timerId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timerId);
  }, []);
  
  useEffect(() => {
    const fetchWeather = (lat: number, lon: number) => {
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=${temperatureUnit}`)
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
  }, [temperatureUnit]);

  const minutes = time.getMinutes().toString().padStart(2, '0');
  const hours24 = time.getHours();

  let displayHours: string;
  let ampm: string | null = null;

  if (settings.format === '12h') {
      ampm = hours24 >= 12 ? 'PM' : 'AM';
      let hours12 = hours24 % 12;
      hours12 = hours12 ? hours12 : 12; // Convert 0 to 12
      displayHours = hours12.toString().padStart(2, '0');
  } else {
      displayHours = hours24.toString().padStart(2, '0');
  }

  const dateString = time.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const colorClasses = themes[settings.theme] || themes.classic;
  const fontClass = fontClasses[settings.font] || fontClasses.fredoka;
  const animationClass = animationClasses[settings.animation] || '';
  const containerStyle = { fontSize: `${settings.size}rem` };
  
  const digitStyle: React.CSSProperties = {
    WebkitTextStroke: `${settings.thickness}px ${settings.theme === 'liquid-glass' ? 'rgba(255, 255, 255, 0.2)' : 'white'}`,
    // FIX: The 'textStroke' property is not a standard CSS property and causes a TypeScript error.
    // @ts-ignore
    textStroke: `${settings.thickness}px ${settings.theme === 'liquid-glass' ? 'rgba(255, 255, 255, 0.2)' : 'white'}`,
    ...(settings.theme === 'liquid-glass' && { textShadow: '0 2px 10px rgba(0,0,0,0.2)' })
  };

  const digitColors = [colorClasses.dark, colorClasses.light, colorClasses.light, colorClasses.dark];

  const horizontalClock = (
    <div className={`flex items-center ${fontClass}`} style={containerStyle}>
      <span className={`${digitColors[0]} clock-digit`} style={digitStyle}>{displayHours[0]}</span>
      <span className={`${digitColors[1]} clock-digit`} style={digitStyle}>{displayHours[1]}</span>
      <span className={`${colorClasses.dark} clock-digit mx-[-0.1em] self-start mt-[0.2em] text-[0.6em]`} style={digitStyle}>:</span>
      <span className={`${digitColors[2]} clock-digit`} style={digitStyle}>{minutes[0]}</span>
      <span className={`${digitColors[3]} clock-digit`} style={digitStyle}>{minutes[1]}</span>
      {ampm && <span className={`${colorClasses.dark} text-[0.25em] font-semibold ml-[0.1em] self-end mb-[0.15em]`}>{ampm}</span>}
    </div>
  );

  const stackedClock = (
     <div className={`flex flex-col items-center leading-[0.8] ${fontClass}`} style={containerStyle}>
        <div className="flex items-baseline">
            <div className="flex">
                <span className={`${digitColors[0]} clock-digit`} style={digitStyle}>{displayHours[0]}</span>
                <span className={`${digitColors[1]} clock-digit`} style={digitStyle}>{displayHours[1]}</span>
            </div>
            {ampm && <span className={`${colorClasses.dark} text-[0.25em] font-semibold ml-[0.1em] self-end mb-[0.15em]`}>{ampm}</span>}
        </div>
        <div className="flex">
            <span className={`${digitColors[2]} clock-digit`} style={digitStyle}>{minutes[0]}</span>
            <span className={`${digitColors[3]} clock-digit`} style={digitStyle}>{minutes[1]}</span>
        </div>
    </div>
  );
  
  const clockLayout = settings.style === 'stacked' ? stackedClock : horizontalClock;
  const wrapperClass = `${settings.style === 'diagonal' ? 'transform -rotate-12' : ''} ${animationClass}`;


  return (
    <div className="flex flex-col items-center justify-center">
      <div className={wrapperClass}>
        {clockLayout}
      </div>
      <div className={`flex items-center space-x-4 mt-2 text-xl font-medium date-weather-font ${settings.theme === 'liquid-glass' ? 'text-white/90' : 'text-gray-700'}`}>
        <span>{dateString}</span>
        {weather && (
          <div className="flex items-center space-x-2">
            <WeatherIcon code={weather.code} />
            <span>{weather.temp}{temperatureUnit === 'celsius' ? '°C' : '°F'}</span>
          </div>
        )}
      </div>
    </div>
  );
};