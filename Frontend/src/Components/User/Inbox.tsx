import { useNavigate } from "react-router-dom"
import UserCombinedLayout from "../UserNav&Footer/SideBar"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import { RootState } from "../../Redux/store"
import { getUserNotifications } from "../../Api/userApiCalls/profileApi"
import { useEffect, useState } from "react"
import { CheckCircle, XCircle, Package, Clock, Truck } from "lucide-react"

interface INotification {
    _id: string;
    orderId: string;
    messege: string;
    isRead: boolean;
    createdAt: string;
}

const Inbox = () => {
    const userId = useSelector((state: RootState) => state.user.id)
    const [notifications, setNotifications] = useState<INotification[]>([])
    const navigate = useNavigate()
  
    const handleUserNotifications = async() => {
        try {
           const response = await getUserNotifications(userId) 
           console.log(response, 'THIS IS FROM NOTIFICATION API FROM INBOX');
           setNotifications(response)
        } catch (error) {
            console.error("Error fetching notifications:", error)
        }
    }

    useEffect(() => {
        handleUserNotifications()
    }, [])

    // Get appropriate icon based on notification message
    const getNotificationIcon = (message: string) => {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('delivered')) {
            return { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' };
        } else if (lowerMessage.includes('cancelled')) {
            return { icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' };
        } else if (lowerMessage.includes('preparing')) {
            return { icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' };
        } else if (lowerMessage.includes('out_for_delivery') || lowerMessage.includes('out for delivery')) {
            return { icon: Truck, color: 'text-purple-600', bg: 'bg-purple-50' };
        } else if (lowerMessage.includes('pending')) {
            return { icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' };
        } else if (lowerMessage.includes('returned')) {
            return { icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50' };
        }
        
        return { icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50' };
    };

    // Format time ago
    const formatTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now.getTime() - date.getTime();
        const diffInMins = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMs / 3600000);
        const diffInDays = Math.floor(diffInMs / 86400000);

        if (diffInMins < 1) return 'Just now';
        if (diffInMins < 60) return `${diffInMins}m ago`;
        if (diffInHours < 24) return `${diffInHours}h ago`;
        if (diffInDays < 7) return `${diffInDays}d ago`;
        
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Extract and format order ID
    const formatOrderId = (message: string) => {
        const match = message.match(/#([a-f0-9]+)/i);
        return match ? match[1].slice(-8) : '';
    };

    return (
    <UserCombinedLayout>
        <div className="min-h-screen bg-gray-50">
            <div className="flex-1">
                {/* Header */}
                <header className="bg-white shadow-sm border-b border-gray-100 px-4 sm:px-6 sticky top-0 z-10">
                    <div className="flex items-center justify-between h-19.5 py-4">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                            Inbox
                        </h2>
                        <div className="flex items-center gap-2">
                            <span className="text-xs sm:text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {notifications.length} notifications
                            </span>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="p-4 sm:p-6 overflow-y-auto max-h-[calc(100vh-64px)]">
                    {/* Back Button */}
                    <button 
                        onClick={() => navigate(-1)} 
                        className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="19" y1="12" x2="5" y2="12" />
                            <polyline points="12 5 5 12 12 19" />
                        </svg>
                        <span className="text-sm font-medium">Back</span>
                    </button>

                    {/* Notifications List */}
                    <div className="max-w-4xl mx-auto space-y-2">
                        {notifications.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                                    <Package className="w-8 h-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500 text-sm">No notifications yet</p>
                            </div>
                        ) : (
                            notifications.map((notification, index) => {
                                const { icon: Icon, color, bg } = getNotificationIcon(notification.messege);
                                const orderId = formatOrderId(notification.messege);
                                
                                return (
                                    <motion.div
                                        key={notification._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full"
                                    >
                                        <div className={`bg-white rounded-lg shadow-sm border ${notification.isRead ? 'border-gray-200' : 'border-orange-200 bg-orange-50/30'} p-4 hover:shadow-md transition-all duration-200 cursor-pointer`}>
                                            <div className="flex items-start gap-3">
                                                {/* Icon */}
                                                <div className={`p-2.5 rounded-lg ${bg} flex-shrink-0`}>
                                                    <Icon className={`w-5 h-5 ${color}`} />
                                                </div>
                                                
                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-gray-800 leading-relaxed">
                                                        {notification.messege.replace(/#[a-f0-9]+/i, `#${orderId}`)}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <span className="text-xs text-gray-500">
                                                            {formatTimeAgo(notification.createdAt)}
                                                        </span>
                                                        {!notification.isRead && (
                                                            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Arrow */}
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="w-4 h-4 text-gray-400 flex-shrink-0 mt-1"
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
                                    </motion.div>
                                );
                            })
                        )}
                    </div>
                </main>
            </div>
        </div>
    </UserCombinedLayout>
    )
}

export default Inbox