import { useState } from 'react';
import {  Menu, X, ChevronDown, LogOut, Settings, User, ListOrderedIcon, InboxIcon, Wallet } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaRobot } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { removeUser } from '../../Redux/Slice/userSlice';
import { removeUserProfile } from '../../Redux/Slice/ProfileSlice/userProfileSlice';

const UserCombinedLayout = ({ children }: any) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch()
    const menuItems = [
        {
            id: 'profile',
            label: 'Profile',
            icon:  User,
            path: '/profile-details'
        },
        {
            id: 'orders',
            label: 'Order List',
            icon: ListOrderedIcon,
            path: '/order-history'
        },
            {
            id: 'inbox',
            label: 'Inbox',
            icon: InboxIcon,
            path: '/inbox'
        },
              {
            id: 'wallet',
            label: 'Wallet',
            icon: Wallet,
            path: '/wallet'
        },
        {
            id: 'help',
            label: 'Help',
            icon: FaRobot,
            path: '/help'
        },
        {
            id: 'settings',
            label: 'Settings',
            icon: Settings,
            path: '/settings'
        },
    ];

    // Get active menu based on current path
    const getActiveMenu = () => {
        const currentItem = menuItems.find(item =>
            location.pathname.startsWith(item.path)
        );
        return currentItem?.id || 'profile';
    };

    const activeMenu = getActiveMenu();

    const handleLogout = () => {
        dispatch(removeUser())
        dispatch(removeUserProfile())
        navigate('/login');
    };

    const handleMenuClick = (path: string) => {
        navigate(path);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`${isSidebarOpen ? 'w-64' : 'w-20'
                    } bg-white text-black transition-all duration-300 ease-in-out shadow-lg flex flex-col`}
            >
                {/* Header */}
                <div className="flex items-center justify-between h-20 px-4 border-b border-orange-400 flex-shrink-0">
                    {isSidebarOpen && (
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                            Flame Zero
                        </h1>
                    )}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 hover:bg-orange-400 rounded-lg transition-colors"
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
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                        ? 'bg-orange-500 text-white'
                                        : 'text-black hover:bg-orange-400 hover:text-white'
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
                <div className="border-t border-orange-400 p-4 flex-shrink-0">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-black hover:bg-orange-500 hover:text-white transition-colors duration-200"
                    >
                        <LogOut className="w-5 h-5 flex-shrink-0" />
                        {isSidebarOpen && (
                            <span className="text-sm font-medium">Logout</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 w-full flex flex-col overflow-hidden">
                {children}
            </div>
        </div>
    );
};

export default UserCombinedLayout;