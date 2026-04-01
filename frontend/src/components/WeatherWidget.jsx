import { useState, useEffect } from 'react';
import axios from 'axios';
import { Cloud, Sun, CloudRain, Wind, AlertCircle } from 'lucide-react';

export default function WeatherWidget() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false); // เพิ่ม State เช็ค Error

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const lat = 12.6113;
        const lon = 102.1038;
        const response = await axios.get(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        setWeather(response.data.current_weather);
        setLoading(false);
      } catch (err) {
        console.error('ไม่สามารถดึงข้อมูลสภาพอากาศได้', err);
        setError(true); // ถ้า Error ให้เก็บค่าไว้
        setLoading(false);
      }
    };

    fetchWeather();
  }, []);

  const getWeatherDetails = (code) => {
    if (code === 0) return { text: 'ฟ้าใส / แดดจัด', icon: <Sun size={24} className="text-warning" /> };
    if (code >= 1 && code <= 3) return { text: 'มีเมฆบางส่วน', icon: <Cloud size={24} className="text-secondary" /> };
    if (code >= 51 && code <= 67) return { text: 'ฝนตกปรอยๆ', icon: <CloudRain size={24} className="text-info" /> };
    if (code >= 80 && code <= 99) return { text: 'ฝนตกหนัก / พายุ', icon: <CloudRain size={24} className="text-primary" /> };
    return { text: 'สภาพอากาศแปรปรวน', icon: <Cloud size={24} /> };
  };

  // ถ้ากำลังโหลด ให้โชว์ป้ายสีเทา
  if (loading) return <span className="badge bg-secondary p-2">กำลังโหลดสภาพอากาศ...</span>;
  
  // ถ้าพัง ให้โชว์ป้ายสีแดง
  if (error || !weather) return (
    <span className="badge bg-danger p-2 d-flex align-items-center gap-1">
      <AlertCircle size={14} /> โหลดสภาพอากาศไม่สำเร็จ
    </span>
  );

  const details = getWeatherDetails(weather.weathercode);

  return (
    <div className="card border-0 shadow-sm rounded-4" style={{ backgroundColor: '#e0f2fe' }}>
      <div className="card-body p-2 px-3 d-flex align-items-center gap-3">
        <div className="bg-white p-2 rounded-circle shadow-sm d-flex align-items-center justify-content-center">
          {details.icon}
        </div>
        <div>
          <h6 className="mb-0 fw-bold" style={{ color: '#0369a1' }}>
            {weather.temperature}°C - {details.text}
          </h6>
          <small className="text-muted d-flex align-items-center gap-1">
            <Wind size={14} /> ลม: {weather.windspeed} km/h
          </small>
        </div>
      </div>
    </div>
  );
}