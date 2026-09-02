const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    current: 'temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m,pressure_msl',
    daily: 'sunrise,sunset,temperature_2m_max,temperature_2m_min,weather_code',
    timezone: 'auto',
    forecast_days: '7',
  });

  const response = await fetch(`${BASE_URL}?${params}`);
  if (!response.ok) throw new Error('خطا در دریافت اطلاعات هوا');
  const data = await response.json();

  return {
    temperature: Math.round(data.current.temperature_2m),
    weatherCode: data.current.weather_code,
    humidity: data.current.relative_humidity_2m,
    windSpeed: Math.round(data.current.wind_speed_10m),
    pressure: Math.round(data.current.pressure_msl),
    daily: data.daily,
    timezone: data.timezone,
  };
}

export function getWeatherInfo(code) {
  if (code === 0) return { label: 'آفتابی', icon: '☀️' };
  if (code <= 3) return { label: 'نیمه ابری', icon: '⛅' };
  if (code <= 48) return { label: 'مه‌آلود', icon: '🌫️' };
  if (code <= 57) return { label: 'نم‌نم باران', icon: '🌦️' };
  if (code <= 67) return { label: 'بارانی', icon: '🌧️' };
  if (code <= 77) return { label: 'برفی', icon: '🌨️' };
  if (code <= 82) return { label: 'باران شدید', icon: '⛈️' };
  if (code <= 86) return { label: 'برف شدید', icon: '❄️' };
  return { label: 'طوفانی', icon: '🌩️' };
}
