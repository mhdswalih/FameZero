import { Bell, RefreshCcw, Shield, Trash } from "lucide-react";
import { motion } from 'framer-motion';
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ChangePasswordModal from "../Modals/User/PasswordChangeModal/PasswordChangeModal";
import toast from "react-hot-toast";
import { changePassword } from "../../Api/userApiCalls/profileApi";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import UserCombinedLayout from "../UserNav&Footer/SideBar";

const UserSettings = () => {
    const navigate = useNavigate();
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const user = useSelector((state:RootState)=> state.user)

    // Define the password change handler
    const handlePasswordChange = async (currentPassword: string, newPassword: string, confirmPassword: string) => {
        try {
            await changePassword(user.id as string,currentPassword,newPassword,confirmPassword)
            toast.success("Password changed successfully!");
            setIsPasswordModalOpen(false);
        } catch (error) {
            toast.error("Failed to change password");
        }
    };

    const profileMenuItems = [
        {
            label: 'Reset Password',
            icon: RefreshCcw,
            onClick: () => setIsPasswordModalOpen(true),
            color: 'text-green-600'
        },
        {
            label: 'Notifications',
            icon: Bell,
            onClick: () => { },
            color: 'text-blue-600'
        },
        {
            label: 'Delete My Account',
            icon: Trash,
            onClick: () => { },
            color: 'text-red-600'
        },
    ];
    return (
        <>
        <UserCombinedLayout>
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
                <main className="p-6">
                    {/* Responsive Back Button */}
                    <div onClick={() => navigate(-1)} className="cursor-pointer mb-4 flex justify-items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon-arrow-left">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 5 5 12 12 19" />
                        </svg>
                    </div>

                    {/* Responsive Settings Items */}
                    <div className="max-w-4xl mx-auto  space-y-2 sm:space-y-3">
                        {profileMenuItems.map(({ label, icon: Icon, onClick, color }, index) => (
                            <motion.button
                                key={label}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full text-left "
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
            <ChangePasswordModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onChangePassword={handlePasswordChange}
            />
        </div>
         </UserCombinedLayout>
    </>
    );
};

export default UserSettings;