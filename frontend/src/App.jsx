import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import WateringForm from './pages/WateringForm';

const API_URL = 'http://localhost:3000/api/water-logs';

function App() {
  const [waterLogs, setWaterLogs] = useState([]);

  // 1. ฟังก์ชันดึงข้อมูล (Read)
  const fetchLogs = async () => {
    try {
      const response = await axios.get(API_URL);
      setWaterLogs(response.data);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  // 2. ฟังก์ชันเพิ่มข้อมูล (Create)
  const addLog = async (newData) => {
    try {
      await axios.post(API_URL, newData);
      fetchLogs(); 
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการบันทึก:', error);
    }
  };

  // 3. ฟังก์ชันแก้ไขข้อมูล (Update)
  const updateLog = async (updatedData) => {
    try {
      await axios.put(`${API_URL}/${updatedData.id}`, updatedData);
      fetchLogs(); 
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการแก้ไข:', error);
    }
  };

  // 4. ฟังก์ชันลบข้อมูล (Delete)
  const deleteLog = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchLogs(); 
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบ:', error);
    }
  };

  return (
    <Router>
      <div className="container-fluid p-0">
        <div className="row g-0">
          <div className="col-12 col-md-3 col-lg-2">
            <Sidebar />
          </div>
          <div className="col-12 col-md-9 col-lg-10 p-4" style={{ minHeight: '100vh' }}>
            <Routes>
              <Route 
                path="/" 
                element={<Dashboard logs={waterLogs} onDelete={deleteLog} onUpdate={updateLog} />} 
              />
              <Route 
                path="/add" 
                element={<WateringForm onAddLog={addLog} />} 
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;