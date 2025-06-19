import React from 'react';
import { FiBell, FiChevronDown } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';

const AdminNavbar: React.FC = () => {
  return (
    <header className="bg-black text-orange-400 shadow-md">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left side - Empty for balance since we have sidebar */}
        <div className="w-1/4"></div>
        
        {/* Center - Could add search or title if needed */}
        <div className="w-2/4 flex justify-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        
        {/* Right side - Notification and Profile */}
        <div className="w-1/4 flex items-center justify-end space-x-4">
          {/* Notification Button */}
          <button className="relative p-2 rounded-full hover:bg-orange-800 transition-colors">
            <FiBell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>
          
          {/* Admin Profile */}
          <div className="flex items-center space-x-2 cursor-pointer group">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-200 text-orange-600">
              <FaUserCircle size={20} />
            </div>
            <span className="font-medium group-hover:text-orange-300">Admin</span>
            <FiChevronDown className="group-hover:text-orange-300" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;