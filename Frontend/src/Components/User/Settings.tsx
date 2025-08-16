import { Bell,icons,RefreshCcw,Shield, Trash } from "lucide-react";
import { motion } from 'framer-motion'
import { useNavigate } from "react-router-dom";

const UserSettings = () => {

    const navigate = useNavigate()
    const profileMenuItems = [
        { label: 'Reset Password',  icon: RefreshCcw, onClick: () => { navigate('/reset-password')} },
        { label: 'Notifications', icon: Bell, onClick: () => { } },
        { label: 'Delete My Account', icon: Trash, onClick: () => { } },

    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">

            <div className="flex-1 lg:ml-0">
                <header className="bg-white shadow-sm border-b border-gray-100">
                    <div className="flex items-center justify-between h-16 px-6">
                        <h2 className="text-lg font-semibold text-gray-900">Settings</h2>
                        <div className="flex items-center gap-2 rounded-full py-1 pr-3 pl-1">
                           
                            <span className="text-sm font-medium text-gray-700"></span>
                        </div>
                    </div>
                </header>

                <main className="p-5">
                    <div onClick={() => navigate(-1)} className="cursor-pointer mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-arrow-left">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 5 5 12 12 19" />
                        </svg>
                    </div>

                    <div className="max-w-4xl mx-auto">
                       

                        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-4 gap-4">
                            {profileMenuItems.map(({ label, icon: Icon, onClick }, index) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 + 0.2 }}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                    onClick={onClick}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="bg-gray-100 p-2 rounded-lg">
                                            <Icon className={`h-5 w-5 ${label === 'Reset Password' ? 'text-green-500' : 'text-gray-900'} ${label === 'Delete My Account' ? 'text-red-600' : 'text-gray-700'} `} />
                                        </div>
                                        <span className={`font-medium  ${label === 'Reset Password'? 'text-green-500':'text-gray-900'} ${label === 'Delete My Account' ? 'text-red-600' : 'text-gray-700'} `}>{label}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default UserSettings;