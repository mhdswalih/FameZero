import { useState } from 'react';
import { Users, UtensilsCrossed, Menu, X, ChevronDown, LogOut, Settings, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const CombinedLayout = ({children } : any) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: BarChart3,
      path: '/admin/dashboard'
    },
    {
      id: 'users',
      label: 'User List',
      icon: Users,
      path: '/admin/user-table'
    },
    {
      id: 'outlets',
      label: 'Food Outlets',
      icon: UtensilsCrossed,
      path: '/admin/hotels-table'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/admin/settings'
    },
  ];

  // Get active menu based on current path
  const getActiveMenu = () => {
    const currentItem = menuItems.find(item => 
      location.pathname.startsWith(item.path)
    );
    return currentItem?.id || 'dashboard';
  };

  const activeMenu = getActiveMenu();

  const handleLogout = () => {
    navigate('/login');
  };

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-black text-white transition-all duration-300 ease-in-out shadow-lg flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-20 px-4 border-b border-gray-800 flex-shrink-0">
          {isSidebarOpen && (
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
              Flame Zero
            </h1>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-900 rounded-lg transition-colors"
          >
            {isSidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                  isActive
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {isSidebarOpen && isActive && (
                  <ChevronDown className="w-4 h-4 ml-auto" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Section */}
        <div className="border-t border-gray-800 p-4 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-900 hover:text-white transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 flex-shrink-0" />
            {isSidebarOpen && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>

          {isSidebarOpen && (
            <div className="mt-4 p-3 bg-gray-900 rounded-lg">
              <p className="text-xs text-gray-400">Admin Panel</p>
              <p className="text-xs text-orange-400 font-semibold mt-1">Version 1.0</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-20 flex items-center px-6 flex-shrink-0">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">
              {menuItems.find((item) => item.id === activeMenu)?.label || 'Dashboard'}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <div className="h-10 w-10 bg-orange-400 rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">
          <div className="bg-white rounded-lg shadow p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CombinedLayout;