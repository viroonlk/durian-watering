import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function WateringChart({ logs }) {
  // 1. คัดกรองเอาเฉพาะข้อมูล "สัปดาห์นี้"
  const now = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);

  const thisWeekLogs = logs.filter(log => {
    const logDate = new Date(log.water_datetime);
    return logDate >= sevenDaysAgo && logDate <= now;
  });

  // 2. คำนวณผลรวม "ระยะเวลา (นาที)" แยกตาม "โซน"
  const dataMap = {};
  thisWeekLogs.forEach(log => {
    if (!dataMap[log.zone]) {
      dataMap[log.zone] = 0;
    }
    // จับเวลามาบวกกัน
    dataMap[log.zone] += Number(log.duration); 
  });

  // 3. แปลงข้อมูลให้อยู่ในรูปแบบที่ Recharts ต้องการ (Array of Objects)
  const chartData = Object.keys(dataMap).map(key => ({
    name: key,
    duration: dataMap[key]
  }));

  // ถ้าไม่มีข้อมูลในสัปดาห์นี้เลย ให้ซ่อนกราฟ
  if (chartData.length === 0) {
    return null; 
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 mb-4">
      <div className="card-body p-4">
        <h5 className="fw-bold mb-4" style={{ color: 'var(--durian-dark)' }}>
          📊 สรุปเวลาการให้น้ำสัปดาห์นี้ (แยกตามโซน)
        </h5>
        
        {/* ตัวกราฟ Bar Chart */}
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fill: '#4b5563', fontSize: 14 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#4b5563' }} axisLine={false} tickLine={false} />
              <Tooltip 
                cursor={{ fill: 'rgba(43, 89, 44, 0.05)' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar 
                dataKey="duration" 
                name="ระยะเวลารวม (นาที)" 
                fill="var(--durian-primary)" 
                radius={[6, 6, 0, 0]} 
                barSize={50}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}