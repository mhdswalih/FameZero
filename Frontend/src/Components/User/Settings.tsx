import { Bell, RefreshCcw, Shield, Trash } from "lucide-react";
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";

const UserSettings = () => {
    const navigate = useNavigate();
    
    const profileMenuItems = [
        { 
            label: 'Reset Password',  
            icon: RefreshCcw, 
            onClick: () => navigate('/reset-password'),
            color: 'text-green-600'
        },
        { 
            label: 'Notifications', 
            icon: Bell, 
            onClick: () => {},
            color: 'text-blue-600'
        },
        { 
            label: 'Delete My Account', 
            icon: Trash, 
            onClick: () => {},
            color: 'text-red-600'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="flex-1">
                {/* Improved Header with responsive text */}
                <header className="bg-white shadow-sm border-b border-gray-100 px-4 sm:px-6 sticky top-0 z-10">
                    <div className="flex items-center justify-between h-16">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                            Settings
                        </h2>
                        <div className="flex items-center gap-2">
                            {/* Empty for potential future icons */}
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-4 sm:p-6 max-w-3xl mx-auto">
                    {/* Responsive Back Button */}
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center mb-4 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="w-4 h-4 sm:w-5 sm:h-5"
                            fill="none" 
                            stroke="currentColor" 
                            strokeWidth="2" 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        >
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 5 5 12 12 19" />
                        </svg>
                        <span className="ml-2 text-xs sm:text-sm">
                            Back
                        </span>
                    </button>

                    {/* Responsive Settings Items */}
                    <div className="space-y-2 sm:space-y-3">
                        {profileMenuItems.map(({ label, icon: Icon, onClick, color }, index) => (
                            <motion.button
                                key={label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full text-left"
                                onClick={onClick}
                            >
                                <div className="bg-white rounded-lg shadow-xs border border-gray-200 p-3 sm:p-4 hover:shadow-sm transition-all duration-200 active:bg-gray-50">
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
                                            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <span className={`font-medium text-xs sm:text-sm md:text-base flex-1 ${color}`}>
                                            {label}
                                        </span>
                                        <svg 
                                            xmlns="http://www.w3.org/2000/svg" 
                                            className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400"
                                            viewBox="0 0 24 24" 
                                            fill="none" 
                                            stroke="currentColor" 
                                            strokeWidth="2" 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round"
                                        >
                                            <polyline points="9 18 15 12 9 6"></polyline>
                                        </svg>
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserSettings;