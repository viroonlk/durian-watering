import { NavLink } from 'react-router-dom';
import { Droplets, LayoutDashboard } from 'lucide-react';

export default function Sidebar() {
  return (
    <div className="sidebar-custom p-3" style={{ width: '250px' }}>
      <h4 className="text-center mb-4 fw-bold">
        <Droplets className="me-2" />
        สวนทุเรียน
      </h4>
      <hr className="text-white" />
      <nav className="nav flex-column">
        <NavLink 
          to="/" 
          className={({ isActive }) => isActive ? "nav-link-custom active" : "nav-link-custom"}
          end
        >
          <LayoutDashboard size={20} />
          รายงานการให้น้ำ
        </NavLink>
        <NavLink 
          to="/add" 
          className={({ isActive }) => isActive ? "nav-link-custom active" : "nav-link-custom"}
        >
          <Droplets size={20} />
          บันทึกการให้น้ำ
        </NavLink>
      </nav>
    </div>
  );
}