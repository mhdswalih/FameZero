import React, { useState } from 'react';
import { 
  FiHome, FiUser, FiSettings, FiPieChart, FiLogOut, 
  FiChevronLeft, FiChevronRight, FiBell, 
  FiChevronDown
} from 'react-icons/fi';
import { FaHotel, FaUserCircle } from 'react-icons/fa';
import { useNavigate, Routes, Route } from 'react-router-dom';
import UserTable from '../tables/Users';

const CombinedLayout: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [activeItem, setActiveItem] = useState('');
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleItemClick = (itemName: string, path: string = '/admin/dashboard') => {
    setActiveItem(itemName);
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar */}
      <aside
        className={`bg-black text-white flex flex-col transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          {!collapsed && <h1 className="text-xl font-bold text-white">FameZero</h1>}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded-full hover:bg-orange-800 text-xl text-orange-400"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <SidebarItem
              icon={<FiHome size={20} className="text-white" />}
              text="Dashboard"
              active={activeItem === 'Dashboard'}
              onClick={() => handleItemClick('Dashboard', '/admin/dashboard')}
              collapsed={collapsed}
            />
            <SidebarItem
              icon={<FaHotel size={20} className="text-white" />}
              text="Hotels/Resorts"
              active={activeItem === 'Hotels'}
              onClick={() => handleItemClick('Hotels', '/admin/hotels-table')}
              collapsed={collapsed}
            />
            <SidebarItem
              icon={<FiUser size={20} className="text-white" />}
              text="Users"
              active={activeItem === 'Users'}
              onClick={() => handleItemClick('Users', '/admin/user-table')}
              collapsed={collapsed}
            />
            <SidebarItem
              icon={<FiPieChart size={20} className="text-white" />}
              text="Analytics"
              active={activeItem === 'Analytics'}
              onClick={() => handleItemClick('Analytics', '/analytics')}
              collapsed={collapsed}
            />
            <SidebarItem
              icon={<FiSettings size={20} className="text-white" />}
              text="Settings"
              active={activeItem === 'Settings'}
              onClick={() => handleItemClick('Settings', '/settings')}
              collapsed={collapsed}
            />
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800">
          <SidebarItem
            icon={<FiLogOut size={20} className="text-white" />}
            text="Logout"
            onClick={() => handleItemClick('Logout', '/admin-login')}
            collapsed={collapsed}
          />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <header className="bg-black-200 text-white shadow-md">
          <div className="flex items-center justify-end h-16 px-6">
            <div className="flex items-center space-x-6">
              {/* Notification Button */}
              <button className="relative p-2 rounded-full hover:bg-orange-800 transition-colors">
                <FiBell size={20} className="text-white" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
              
              {/* Admin Profile */}
              <div className="flex items-center space-x-2 cursor-pointer group">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-200 text-orange-600">
                  <FaUserCircle size={20} />
                </div>
                {!collapsed && (
                  <>
                    <span className="font-medium text-white group-hover:text-orange-300">Admin</span>
                    <FiChevronDown className="text-white group-hover:text-orange-300" />
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 bg-black text-white">
          <Routes>
            <Route path="/user-table" element={<UserTable />} />
            <Route path="*" element={children} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Updated SidebarItem Component with white text
const SidebarItem: React.FC<{
  icon: React.ReactNode;
  text: string;
  active?: boolean;
  onClick?: () => void;
  collapsed?: boolean;
}> = ({ icon, text, active = false, onClick, collapsed = false }) => {
  return (
    <li
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
        active ? 'bg-orange-200 text-orange-600' : 'text-white hover:bg-orange-800 hover:text-white'
      }`}
      onClick={onClick}
      title={collapsed ? text : undefined}
    >
      <span className={`${collapsed ? 'mx-auto' : 'mr-3'}`}>{icon}</span>
      {!collapsed && <span className="font-medium">{text}</span>}
    </li>
  );
};

export default CombinedLayout;