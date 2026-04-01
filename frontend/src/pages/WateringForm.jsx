import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function WateringForm({ onAddLog }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    zone: 'แปลง A (ทุเรียนให้ผล)', // ค่าเริ่มต้น
    water_datetime: '',
    duration: '',
    note: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.water_datetime || !formData.duration) {
      alert('กรุณากรอกข้อมูล วันเวลา และ ระยะเวลาให้ครบถ้วน!');
      return;
    }
    await onAddLog(formData);
    alert('บันทึกข้อมูลลงฐานข้อมูลสำเร็จ!');
    navigate('/'); // กลับไปหน้ารายงาน
  };

  return (
    <div className="container-fluid p-0 max-w-7xl">
      <h2 className="mb-4 fw-bold" style={{ color: 'var(--durian-dark)' }}>บันทึกการให้น้ำ</h2>
      <div className="card data-card p-4">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">โซน / แปลงที่ให้น้ำ</label>
              <select className="form-select" name="zone" value={formData.zone} onChange={handleChange}>
                <option value="แปลง A (ทุเรียนให้ผล)">แปลง A (ทุเรียนให้ผล)</option>
                <option value="แปลง B (ทุเรียนเล็ก)">แปลง B (ทุเรียนเล็ก)</option>
                <option value="โซนหน้าบ้าน">โซนหน้าบ้าน</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">วันและเวลาที่ให้น้ำ</label>
              <input type="datetime-local" className="form-control" name="water_datetime" value={formData.water_datetime} onChange={handleChange} required />
            </div>
          </div>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">ระยะเวลาที่ให้น้ำ (นาที)</label>
              <input type="number" className="form-control" name="duration" value={formData.duration} onChange={handleChange} placeholder="เช่น 45" required />
            </div>
            <div className="col-md-6 mb-4">
              <label className="form-label fw-bold">หมายเหตุ (สภาพอากาศ / การผสมปุ๋ย)</label>
              <input type="text" className="form-control" name="note" value={formData.note} onChange={handleChange} placeholder="เช่น แดดจัด, ผสมปุ๋ยสูตร 15-15-15" />
            </div>
          </div>
          <button type="submit" className="btn text-white px-4 py-2" style={{ backgroundColor: 'var(--durian-primary)' }}>
            บันทึกข้อมูล
          </button>
        </form>
      </div>
    </div>
  );
}