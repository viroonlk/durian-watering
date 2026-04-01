import { useState } from 'react';
import { Trash2, Clock, BookOpen, MapPin, Pencil, Check, X } from 'lucide-react';
import WeatherWidget from '../components/WeatherWidget';
import WateringChart from '../components/WateringChart';

export default function Dashboard({ logs, onDelete, onUpdate }) {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({});

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return `${date.toLocaleDateString('th-TH')} ${date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const toLocalISOString = (dateString) => {
    const date = new Date(dateString);
    const tzOffset = date.getTimezoneOffset() * 60000; 
    return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const handleEditClick = (log) => {
    setEditId(log.id);
    setEditData({ ...log, water_datetime: toLocalISOString(log.water_datetime) });
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = () => {
    onUpdate(editData);
    setEditId(null);
  };

  const filteredLogs = logs.filter((log) => {
    if (activeFilter === 'all') return true;
    const logDate = new Date(log.water_datetime);
    const now = new Date();
    if (activeFilter === 'week') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return logDate >= sevenDaysAgo && logDate <= now;
    }
    if (activeFilter === 'month') {
      return logDate.getMonth() === now.getMonth() && logDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  return (
    <div className="container-fluid p-0 max-w-7xl">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        
        <div className="d-flex flex-column flex-md-row align-items-md-center gap-4">
          <h2 className="m-0 fw-bold" style={{ color: 'var(--durian-dark)' }}>รายงานการให้น้ำ</h2>
          <WeatherWidget /> 
        </div>

        <div className="d-flex">
          <button className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`} onClick={() => setActiveFilter('all')}>ทั้งหมด</button>
          <button className={`filter-btn ${activeFilter === 'week' ? 'active' : ''}`} onClick={() => setActiveFilter('week')}>สัปดาห์นี้</button>
          <button className={`filter-btn ${activeFilter === 'month' ? 'active' : ''}`} onClick={() => setActiveFilter('month')}>เดือนนี้</button>
        </div>
      </div>

      {/* === เพิ่มกราฟแท่งตรงนี้ครับ === */}
      <WateringChart logs={logs} />
      {/* ======================= */}

      <div className="row g-4">
        {filteredLogs.length === 0 ? (
          <div className="col-12 text-center p-5 text-muted">
             {logs.length === 0 ? "กำลังโหลดข้อมูล..." : "ไม่มีข้อมูลการให้น้ำในช่วงเวลาที่เลือก"}
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div className="col-12 col-md-6 col-xl-4" key={log.id}>
              <div className="card data-card h-100 p-4">
                {editId === log.id ? (
                  <div className="d-flex flex-column h-100 gap-2">
                    <select className="form-select form-select-sm fw-bold text-primary mb-1" name="zone" value={editData.zone} onChange={handleChange}>
                      <option value="แปลง A (ทุเรียนให้ผล)">แปลง A (ทุเรียนให้ผล)</option>
                      <option value="แปลง B (ทุเรียนเล็ก)">แปลง B (ทุเรียนเล็ก)</option>
                      <option value="โซนหน้าบ้าน">โซนหน้าบ้าน</option>
                    </select>
                    <input type="datetime-local" className="form-control form-control-sm mb-2" name="water_datetime" value={editData.water_datetime} onChange={handleChange} />
                    <div className="input-group input-group-sm mb-2">
                      <span className="input-group-text"><Clock size={16} /></span>
                      <input type="number" className="form-control" name="duration" value={editData.duration} onChange={handleChange} placeholder="นาที" />
                      <span className="input-group-text">นาที</span>
                    </div>
                    <input type="text" className="form-control form-control-sm mb-3" name="note" value={editData.note} onChange={handleChange} placeholder="หมายเหตุ" />
                    <div className="mt-auto d-flex justify-content-end gap-2 border-top pt-3">
                      <button className="btn btn-sm btn-success d-flex align-items-center" onClick={handleSaveEdit}>
                        <Check size={16} className="me-1" /> บันทึก
                      </button>
                      <button className="btn btn-sm btn-secondary d-flex align-items-center" onClick={() => setEditId(null)}>
                        <X size={16} className="me-1" /> ยกเลิก
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 border-bottom pb-2">
                      <h5 className="fw-bold mb-1 d-flex align-items-center gap-2" style={{ color: 'var(--durian-primary)' }}>
                        <MapPin size={20} />
                        {log.zone}
                      </h5>
                      <small className="text-muted">
                        {formatDateTime(log.water_datetime)}
                      </small>
                    </div>
                    <div className="mb-3">
                      <small className="text-muted d-block mb-1">ระยะเวลา</small>
                      <div className="d-flex align-items-center gap-2 fw-semibold">
                        <Clock size={18} style={{ color: '#d97706' }} />
                        {log.duration} นาที
                      </div>
                    </div>
                    <div className="mb-4">
                      <small className="text-muted d-block mb-1">หมายเหตุ</small>
                      <div className="d-flex align-items-center gap-2 text-secondary">
                        <BookOpen size={18} />
                        {log.note || '-'}
                      </div>
                    </div>
                    <div className="mt-auto d-flex justify-content-end gap-2 pt-3 border-top">
                      <button className="btn btn-sm btn-outline-primary d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', borderRadius: '8px' }} onClick={() => handleEditClick(log)}>
                        <Pencil size={16} />
                      </button>
                      <button className="btn btn-sm btn-danger d-flex align-items-center justify-content-center" style={{ width: '36px', height: '36px', borderRadius: '8px' }} onClick={() => { if(window.confirm(`ต้องการลบข้อมูลของ ${log.zone} ใช่หรือไม่?`)) onDelete(log.id); }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}