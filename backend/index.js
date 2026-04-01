const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const fs = require('fs'); // <--- 1. อย่าลืมเพิ่ม fs (File System) บรรทัดนี้
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 2. อัปเดตการตั้งค่า Database
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // <--- เพิ่ม Port
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    ca: fs.readFileSync(__dirname + '/ca.pem') // <--- เพิ่มการอ่านไฟล์ SSL
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ทดสอบการเชื่อมต่อ
db.getConnection((err, connection) => {
  if (err) {
    console.error('เกิดข้อผิดพลาดในการเชื่อมต่อ Database:', err.message);
  } else {
    console.log('เชื่อมต่อ Database สวนทุเรียน บน Aiven สำเร็จแล้ว! 🥥');
    connection.release();
  }
});

// ... (โค้ด API Endpoints อื่นๆ ด้านล่างปล่อยไว้เหมือนเดิมครับ) ...

// ==========================================
// 2. สร้าง API Endpoints (CRUD)
// ==========================================

// [GET] ดึงข้อมูลรายงานการให้น้ำทั้งหมด (Report)
app.get('/api/water-logs', (req, res) => {
  // เรียงจากวันที่ให้น้ำล่าสุดขึ้นก่อน
  const sql = 'SELECT * FROM water_logs ORDER BY water_datetime DESC';
  
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// [POST] บันทึกการให้น้ำใหม่ (Create)
app.post('/api/water-logs', (req, res) => {
  const { zone, water_datetime, duration, note } = req.body;
  
  const sql = 'INSERT INTO water_logs (zone, water_datetime, duration, note) VALUES (?, ?, ?, ?)';
  const values = [zone, water_datetime, duration, note];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ 
      message: 'บันทึกข้อมูลสำเร็จ', 
      insertId: result.insertId 
    });
  });
});

// [PUT] แก้ไขข้อมูลการให้น้ำ (Update)
app.put('/api/water-logs/:id', (req, res) => {
  const { id } = req.params;
  const { zone, water_datetime, duration, note } = req.body;

  const sql = 'UPDATE water_logs SET zone = ?, water_datetime = ?, duration = ?, note = ? WHERE id = ?';
  const values = [zone, water_datetime, duration, note, id];

  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการแก้ไข' });
    res.json({ message: 'อัปเดตข้อมูลสำเร็จ' });
  });
});

// [DELETE] ลบข้อมูลการให้น้ำ (Delete)
app.delete('/api/water-logs/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM water_logs WHERE id = ?';
  
  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0) return res.status(404).json({ message: 'ไม่พบข้อมูลที่ต้องการลบ' });
    res.json({ message: 'ลบข้อมูลสำเร็จ' });
  });
});

// ==========================================
// 3. สั่งให้ Server เริ่มทำงาน
// ==========================================
app.listen(PORT, () => {
  console.log(`🚀 Backend is running on http://localhost:${PORT}`);
});