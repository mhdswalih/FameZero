import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  MapPin,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  AlertCircle,
  Filter
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { getOrdersList, updateOrderStatus } from '../../Api/hotelApiCalls/hotelProfileApi';
import { IOrderResponse } from '../../Types/IOrderList';
import PreviewModal from '../Modals/User/PreviewModal';
import toast from 'react-hot-toast';
import SocketService from '../../Utils/socket-service';
import SideBar from '../HotelNav&Footer/SideBar';

interface OrderProduct {
  productId: string;
  category: string;
  productName: string;
  price: number;
  quantity: number;
  cartQuantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  products: OrderProduct[];
  totalAmount: number;
  orderStatus: 'Pending' | 'Preparing' | 'Out_for_delivery' | 'Delivered' | 'Cancelled' | 'Returned';
  paymentMethod: string;
  paymentStatus: string;
  orderDate: Date;
}

const OrderList = () => {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const hotel = useSelector((state: RootState) => state.user)
  const [orders, setOrders] = useState<IOrderResponse>([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [previewModal, setPreviewModal] = useState(false)
  const statusOptions: Array<'all' | Order['orderStatus']> = [
    'all',
    'Pending',
    'Preparing',
    'Out_for_delivery',
    'Delivered',
    'Cancelled',
    'Returned'
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'Cancelled': return 'text-red-600 bg-red-50 border-red-200';
      case 'Returned': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Preparing': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'Pending': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Out_for_delivery': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      case 'Returned': return <AlertCircle className="w-4 h-4" />;
      case 'Preparing': return <Package className="w-4 h-4" />;
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Out_for_delivery': return <Truck className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };


  const getOrders = async () => {
    try {
      const response = await getOrdersList(hotel.id)
      setOrders(response)
    } catch (error) {
    }
  }

  useEffect(() => {
    getOrders()
  }, [])

  const handleStatusUpdate = async (orderId: string, userId: string, newStatus: Order['orderStatus']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order._id === orderId ? { ...order, orderStatus: newStatus } : order
      )
    );
    try {
      const response = await updateOrderStatus(orderId, userId, newStatus)

      console.log(response,'THIS IS FROM STATUS ');
      
      toast.success(response.message)
    } catch (error: any) {
      toast.error(error.message)
    }
  };

  

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = filterStatus === 'all'
    ? orders
    : orders.filter(order => order.orderStatus === filterStatus);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  return (
    <>
   <SideBar>
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Management</h1>
              <p className="text-gray-600">Manage and update customer orders</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-3xl font-bold text-amber-600">{orders.length}</p>
            </div>
          </div>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by Status</span>
          </div>
          <div className="flex flex-wrap gap-2 bg-white p-2 rounded-xl shadow-sm border border-gray-200">
            {statusOptions.map((status) => {
              const count = status === 'all'
                ? orders.length
                : orders.filter(o => o.orderStatus === status).length;

              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${filterStatus === status
                    ? 'bg-amber-500 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }`}
                >
                  <span className="capitalize">{status.replace('_', ' ')}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${filterStatus === status
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-600'
                    }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Orders List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {filteredOrders.map((order) => (
            <motion.div
              key={order._id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Order Summary */}
              <div className="p-6">
                {/* Header Row */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img onClick={() => setPreviewModal(true)} src={order.user.profilepic} className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.user.name}</h3>
                      <p className="text-sm text-gray-500">Order #{order.user._id}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {/* <span className="text-sm text-gray-600">{formatDate(order.orderDate)}</span> */}
                      </div>
                    </div>
                  </div>

                  <div className="text-right flex flex-col items-end space-y-2">
                    <div className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(order.orderStatus)}`}>
                      {getStatusIcon(order.orderStatus)}
                      <span className="capitalize">{order.orderStatus.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center text-xl font-bold text-gray-900">
                      <DollarSign className="w-5 h-5" />
                      <span>{order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Order Info Row */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700">{order.products.length} items</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-700 capitalize">{order.orderMethod}</span>
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${order.paymentStatus.toLowerCase() === 'paid'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                      }`}>
                      {order.paymentStatus}
                    </div>
                  </div>

                  <button
                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                    className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-amber-50"
                  >
                    <span>Details</span>
                    {expandedOrder === order._id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Status Update Buttons */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    Update Status:
                  </span>
                  {['Pending', 'Preparing', 'Out_for_delivery', 'Delivered', 'Cancelled', 'Returned'].map((status) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(order._id, order.user.userId, status as Order['orderStatus'])}
                      disabled={order.orderStatus === status}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${order.orderStatus === status
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-amber-50 hover:border-amber-300 hover:text-amber-700'
                        }`}
                    >
                      {status.replace('_', ' ').charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')},
                    </button>

                  ))}
                </div>
              </div>

              {/* Expanded Order Details */}
              <AnimatePresence>
                {expandedOrder === order._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="border-t border-gray-200"
                  >
                    <div className="p-6 bg-gradient-to-br from-gray-50 to-white">
                      {/* Order Items */}
                      <div className="mb-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.products.map((product) => (
                            <div
                              key={product.productId}
                              className="flex items-center justify-between bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg flex items-center justify-center">
                                  <Package className="w-6 h-6 text-amber-600" />
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900">{product.productDetails.productName}</h5>
                                  <p className="text-sm text-gray-600">
                                    {product.productDetails.category} • Qty: {product.cartQuantity}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center text-gray-900 font-semibold">
                                <DollarSign className="w-4 h-4" />
                                <span>{(product.productDetails.price * product.cartQuantity).toFixed(2)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Customer Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Customer Details</h4>
                          <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-3">
                            <div className="flex items-center space-x-3">
                              <User className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium text-gray-900">{order.user.name}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <Phone className="w-5 h-5 text-gray-400" />
                              <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium text-gray-900">{order.user.phone}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Delivery Address</h4>
                          <div className="bg-white p-4 rounded-lg border border-gray-200">
                            <div className="flex items-start space-x-3">
                              <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                              <p className="text-gray-700 leading-relaxed">{order.user.address}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-6 flex flex-wrap gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 shadow-md"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Call Customer</span>
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md"
                        >
                          <MapPin className="w-4 h-4" />
                          <span>View Location</span>
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <PreviewModal
                previewImg={order.user.profilepic}
                onClose={() => setPreviewModal(false)}
                open={previewModal}
              />
            </motion.div>

          ))}
        </motion.div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-600">
              {filterStatus === 'all'
                ? 'No orders available at the moment'
                : `No ${filterStatus.replace('_', ' ')} orders`}
            </p>
          </motion.div>
        )}
      </div>
    </div>
    </SideBar>
      </>
  );
};

export default OrderList;