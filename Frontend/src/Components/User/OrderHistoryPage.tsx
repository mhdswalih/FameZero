import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  MapPin,
  Star,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Phone,
  MessageSquare,
  RotateCcw,
  Receipt,
  Calendar,
  IndianRupee,
  CreditCard,
  DollarSign,
  RefreshCcwIcon,
  MoveRight
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { cancelOrder, fetchOrderHistory, RePayOption, RePayUpdatePaymentStatus } from '../../Api/userApiCalls/productApi';
import { PayPalButtons } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';
import UserCombinedLayout from '../UserNav&Footer/SideBar';

// Updated interface to match your backend structure
export interface IOrderHistory {
  _id?: string;
  userId: string;
  cartId: string;
  products: {
    productId: string;
    productDetails: {
      category: string;
      productName: string;
      price: number;
      quantity: number;
    };
    cartQuantity: number;
  }[];
  totalAmount: number;
  orderStatus: string;
  selectedPaymentMethod: string;
  paypalOrderId: string;
  paymentStatus: string;
  orderDate: Date | string;

  hotelId: string;
  hotelName: string;
  hotelEmail: string;
  hotelProfilePic: string;
  hotelIdProof: string;
  hotelStatus: string;
  hotelLocation: {
    type: string;
    coordinates: number[];
    locationName: string;
  };
  hotelCity: string;
  hotelPhone: string;
}
interface GroupedOrder {
  id: string;
  userId: string;
  totalAmount: number;
  orderStatus: string;
  selectedPaymentMethod: string;
  paymentStatus: string;
  paypalOrderId: string
  orderDate: Date | string;
  hotelId: string;
  hotelName: string;
  hotelProfilePic: string;
  hotelEmail: string;
  hotelCity: string;
  hotelLocation: {
    type: string;
    coordinates: number[];
    locationName: string;
  };
  hotelPhone: string;
  products: {
    productId: string;
    category: string;
    productName: string;
    price: number;
    quantity: number;
    cartQuantity: number;
  }[];
}

const OrderHistoryPage = () => {
  const user = useSelector((state: RootState) => state.userProfile)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [orderHistory, setOrderHistory] = useState<IOrderHistory[]>([])
  const [groupedOrders, setGroupedOrders] = useState<GroupedOrder[]>([])
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  // const [{ isPending }] = usePayPalScriptReducer();
  const [showPayPalButtons, setShowPayPalButtons] = useState<{ [key: string]: boolean }>({});
  const userId = useSelector((state: RootState) => state.user.id)
  const navigate = useNavigate()

  const handleFetchOrderHistory = async () => {
    try {
      const response = await fetchOrderHistory(user._id)

      if (response && response.orderDetails) {
        setOrderHistory(response.orderDetails)
        const grouped = groupOrders(response.orderDetails);
        setGroupedOrders(grouped);
      } else {
        toast.error('Failed to load order history');
      }
    } catch (error) {
      toast.error('Failed to load order history');
    }
  }

  const handleCanceOrder = async (orderId: string) => {
    try {
      const response = await cancelOrder(orderId, userId)
      toast.success('asdasdasd')
    } catch (error) {

    }
  }
  // Function to safely extract product details
  const getProductDetails = (product: any) => {
    // Check if productDetails exists and has the expected structure
    if (product.productDetails && typeof product.productDetails === 'object') {
      return {
        category: product.productDetails.category || 'Unknown',
        productName: product.productDetails.productName || 'Unknown Product',
        price: product.productDetails.price || 0,
        quantity: product.productDetails.quantity || 0
      };
    }

    // Fallback to direct properties if productDetails doesn't exist
    return {
      category: product.category || 'Unknown',
      productName: product.productName || 'Unknown Product',
      price: product.price || 0,
      quantity: product.quantity || 0
    };
  };

  // Function to group orders by cartId or orderId
  const groupOrders = (orders: IOrderHistory[]): GroupedOrder[] => {
    return orders.map(order => {
      // Safely process products
      const processedProducts = (order.products || []).map(product => {
        const details = getProductDetails(product);
        return {
          productId: product.productId || 'unknown',
          paypalOrderId: order.paypalOrderId,
          category: details.category,
          productName: details.productName,
          price: details.price,
          quantity: details.quantity,
          cartQuantity: product.cartQuantity || 1
        };
      });

      return {
        id: order._id || order.cartId || 'unknown',
        userId: order.userId || 'unknown',
        totalAmount: order.totalAmount || 0,
        orderStatus: order.orderStatus || 'Pending',
        selectedPaymentMethod: order.selectedPaymentMethod || 'unknown',
        paymentStatus: order.paymentStatus || 'Pending',
        paypalOrderId: order.paypalOrderId || '',
        orderDate: order.orderDate || new Date(),
        hotelId: order.hotelId || 'unknown',
        hotelName: order.hotelName || 'Unknown Hotel',
        hotelProfilePic: order.hotelProfilePic || '',
        hotelEmail: order.hotelEmail || '',
        hotelCity: order.hotelCity || '',
        hotelLocation: order.hotelLocation || '',
        hotelPhone: order.hotelPhone || '',
        products: processedProducts
      };
    });
  };

  const handleCustomButtonClick = (orderId: string) => {
    handleRepayment(orderId);
    setShowPayPalButtons(prev => ({
      ...prev,
      [orderId]: true
    }));
  };

  useEffect(() => {
    if (user._id) {
      handleFetchOrderHistory()
    }
  }, [user._id])

  const handleRepayment = async (orderId: string) => {
    setProcessingPayment(orderId);
    try {
      const response = await RePayOption(orderId);
      if (!response.payementStatus._id) {
        throw new Error("Payment status ID missing in response");
      }

      toast.success("Payment updated successfully:");
    } catch (error) {
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleUpdatedStatus = async (orderId: string, payementStatus: string) => {
    try {
      await RePayUpdatePaymentStatus(
        orderId, payementStatus
      );
    } catch (error) {

    }
  }

  useEffect(() => {
    handleUpdatedStatus
  }, [])

  const shouldShowRepayButton = (paymentStatus: string) => {
    const status = paymentStatus.toLowerCase();
    return status === 'Failed' || status === 'Pending';
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'Delivered': return 'text-green-600 bg-green-50';
      case 'Cancelled': return 'text-red-600 bg-red-50';
      case 'Preparing': return 'text-yellow-600 bg-yellow-50';
      case 'Returned': return 'text-yellow-600 bg-yellow-50';
      case 'Pending': return 'text-orange-600 bg-orange-50';
      case 'Out_for_delivery': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'Delivered': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelled': return <XCircle className="w-4 h-4" />;
      case 'Preparing': return <Package className="w-4 h-4" />;
      case 'Returned': return <Truck className='2-4 h-4' />
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'Out_for_delivery': return <Truck className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case 'Paid':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'Failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'Pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateInput: Date | string) => {
    try {
      const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };


  const filteredOrders = filterStatus === 'all'
    ? groupedOrders
    : groupedOrders.filter(order => order.orderStatus.toLowerCase() === filterStatus.toLowerCase());

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };
  const statusOptions = ['all', 'Pending', 'Delivered', 'Cancelled', 'Preparing', 'Out_for_delivery', 'Returned'];

  return (

    <>
      <UserCombinedLayout>
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-100 px-4 sm:px-6 sticky top-0 z-10">
          <div className="flex items-center justify-between h-19.5 py-4">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              Order History
            </h2>
         </div>
        </header>
        <div className="min-h-screen overflow-auto bg-white py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Order History</h1>
              <p className="text-gray-600">Track your past orders and reorder your favorites</p>
            </motion.div>

            {/* Filter Tabs */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6"
            >
              <div className="flex flex-wrap gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-200">
                {statusOptions.map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filterStatus === status
                      ? 'bg-amber-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                      }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </button>
                ))}
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
                  key={order.id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
                >
                  {/* Order Summary */}
                  <div className="p-6">
                    {/* Header Row - Hotel Info and Status */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        {/* Updated to use hotelProfilePic */}
                        {order.hotelProfilePic ? (
                          <img
                            src={order.hotelProfilePic}
                            alt={order.hotelName}
                            className="w-16 h-16 rounded-xl object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              target.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        {/* Fallback for missing image */}
                        <div className={`w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center ${order.hotelProfilePic ? 'hidden' : ''}`}>
                          <Package className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{order.hotelName}</h3>
                          <p className="text-sm text-gray-500">Order #{order.paypalOrderId}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{formatDate(order.orderDate)}</span>

                          </div>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end space-y-2">
                        <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                          {getStatusIcon(order.orderStatus)}
                          <span className="capitalize">{order.orderStatus.replace('_', ' ')}</span>
                        </div>
                        <div className="flex items-center text-lg font-bold text-gray-900">
                          <DollarSign className="w-5 h-5" />
                          <span>{order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Order Info and Actions Row */}
                    <div className="flex items-center justify-between">
                      {/* Left side - Order Info */}
                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Package className="w-4 h-4" />
                          <span>{order.products?.length || 0} items</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <CreditCard className="w-4 h-4" />
                          <span className="capitalize">{order.selectedPaymentMethod}</span>
                        </div>
                        <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus.toLowerCase() === 'failed' ? (
                            <XCircle className="w-3 h-3 mr-1" />
                          ) : (order.paymentStatus.toLowerCase() === 'paid' || order.paymentStatus.toLowerCase() === 'completed') ? (
                            <CheckCircle className="w-3 h-3 mr-1" />
                          ) : (
                            <Clock className="w-3 h-3 mr-1" />
                          )}
                          <span className="capitalize">{order.paymentStatus}</span>
                        </div>
                        <button className='bg-red-400 text-white font-bold w-30 h-7 rounded-md' onClick={() => handleCanceOrder(order.id)}>Cancel Order</button>
                      </div>

                      {/* Right side - Actions */}
                      <div className="flex items-center space-x-3">
                        {/* Re-pay button logic */}
                        {shouldShowRepayButton(order.paymentStatus) && (
                          <div>
                            {!showPayPalButtons[order.id] ? (
                              <button
                                onClick={() => handleCustomButtonClick(order.id)}
                                disabled={processingPayment === order.id}
                                className={`flex items-center space-x-2 ${order.paymentStatus.toLowerCase() === 'failed'
                                  ? 'text-red-600 hover:text-red-700'
                                  : 'text-orange-600 hover:text-orange-700'
                                  } px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${processingPayment === order.id ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'
                                  }`}
                              >
                                <RefreshCcwIcon className="w-4 h-4" />
                                {processingPayment === order.id ? (
                                  <>
                                    <svg
                                      className="animate-spin -ml-1 mr-1 h-4 w-4 text-current"
                                      xmlns="http://www.w3.org/2000/svg"
                                      fill="none"
                                      viewBox="0 0 24 24"
                                    >
                                      <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                      ></circle>
                                      <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                      ></path>
                                    </svg>
                                    <span>Processing...</span>
                                  </>
                                ) : (
                                  <span>Re-Pay</span>
                                )}
                              </button>
                            ) : (
                              <div className="w-full">
                                <PayPalButtons
                                  style={{
                                    layout: "horizontal",
                                    color: "gold",
                                    shape: "rect",
                                    height: 40,
                                    label: "pay",
                                    tagline: false,
                                  }}
                                  createOrder={(_data, actions) => {
                                    try {
                                      if (typeof order.totalAmount !== "number" || order.totalAmount <= 0) {
                                        throw new Error("Invalid order amount");
                                      }
                                      const amountValue = order.totalAmount.toFixed(2);
                                      if (parseFloat(amountValue) <= 0) {
                                        throw new Error("Order amount must be greater than 0");
                                      }

                                      return actions.order.create({
                                        intent: "CAPTURE",
                                        purchase_units: [
                                          {
                                            amount: {
                                              currency_code: "USD",
                                              value: amountValue,
                                            },
                                          },
                                        ],
                                      });
                                    } catch (error) {
                                      console.error("Error creating PayPal order:", error);
                                      alert(
                                        "There was an error processing your payment. Please try again."
                                      );
                                      return Promise.reject(error);
                                    }
                                  }}
                                  onApprove={async (_data, actions) => {
                                    try {
                                      const details = await actions.order?.capture();
                                      console.log("Payment successful:", details);
                                      await RePayUpdatePaymentStatus(order.id, "Paid");

                                      toast.success("Payment successful!");
                                      setShowPayPalButtons(prev => ({
                                        ...prev,
                                        [order.id]: false
                                      }));
                                      handleFetchOrderHistory();
                                    } catch (err) {
                                      console.error("Error capturing PayPal order:", err);
                                      await RePayUpdatePaymentStatus(order.id, "Failed");
                                      toast.error("Something went wrong while capturing payment.");
                                    }
                                  }}
                                  onError={async (err) => {
                                    console.error("PayPal error:", err);
                                    await RePayUpdatePaymentStatus(order.id, "Failed");

                                    toast.error("Payment failed. Please try again.");
                                    setShowPayPalButtons(prev => ({
                                      ...prev,
                                      [order.id]: false
                                    }));
                                  }}
                                  onCancel={async () => {
                                    console.warn("Payment cancelled by user");
                                    await RePayUpdatePaymentStatus(order.id, "Failed");

                                    toast.error("Payment cancelled.");
                                    setShowPayPalButtons(prev => ({
                                      ...prev,
                                      [order.id]: false
                                    }));
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {/* View Details button */}
                        <button
                          onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                          className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-amber-50"
                        >
                          <span>View Details</span>
                          {expandedOrder === order.id ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Order Details */}
                  <AnimatePresence>
                    {expandedOrder === order.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="border-t border-gray-100"
                      >
                        <div className="p-6 bg-gray-50">
                          {/* Order Items */}
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Order Items</h4>
                            <div className="space-y-3">
                              {order.products?.map((product, index) => (
                                <div
                                  key={product.productId || index}
                                  className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                      <Package className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div>
                                      <h5 className="font-medium text-gray-900">{product.productName}</h5>
                                      <p className="text-sm text-gray-600">
                                        Category: {product.category} | Qty: {product.cartQuantity}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center text-gray-900 font-medium">
                                    <IndianRupee className="w-4 h-4" />
                                    <span>
                                      {(product.price * product.cartQuantity).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Tracking */}
                          <div className="mb-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Order Status</h4>
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.orderStatus.toLowerCase() === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                  {getStatusIcon(order.orderStatus)}
                                </div>
                                <div className="flex-1">
                                  <p className={`font-medium capitalize ${order.orderStatus.toLowerCase() === 'delivered' ? 'text-gray-900' : 'text-gray-500'}`}>
                                    {order.orderStatus.replace('_', ' ')}
                                  </p>
                                  <p className="text-sm text-gray-500">Last updated: {formatDate(order.orderDate)}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Delivery Details */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-3">Delivery Address</h4>
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="flex items-start space-x-2">
                                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                  <p className="text-gray-700">{user.address || 'No address provided'}</p>
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="text-lg font-semibold text-gray-900 mb-3">Payment Details</h4>
                              <div className="bg-white p-4 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                    <p className="text-gray-700 capitalize">{order.selectedPaymentMethod}</p>
                                  </div>
                                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                                    {order.paymentStatus.toLowerCase() === 'failed' ? (
                                      <XCircle className="w-3 h-3 mr-1" />
                                    ) : (order.paymentStatus.toLowerCase() === 'paid' || order.paymentStatus.toLowerCase() === 'completed') ? (
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                    ) : (
                                      <Clock className="w-3 h-3 mr-1" />
                                    )}
                                    <span className="capitalize">{order.paymentStatus}</span>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                  <span className="text-sm text-gray-600">Total Amount:</span>
                                  <div className="flex items-center font-semibold text-gray-900">
                                    <DollarSign className="w-4 h-4" />
                                    <span>{order.totalAmount.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Hotel Contact - Updated to use new field names */}
                          <div className="mt-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Hotel Information</h4>
                            <div className="bg-white p-4 rounded-lg border border-gray-200">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  {order.hotelProfilePic ? (
                                    <img
                                      src={order.hotelProfilePic}
                                      alt={order.hotelName}
                                      className="w-10 h-10 rounded-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.nextElementSibling?.classList.remove('hidden');
                                      }}
                                    />
                                  ) : null}
                                  <div className={`w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center ${order.hotelProfilePic ? 'hidden' : ''}`}>
                                    <Package className="w-5 h-5 text-gray-400" />
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">{order.hotelName}</p>
                                    <p className="text-sm text-gray-600">{order.hotelLocation.locationName || order.hotelCity}</p>
                                  </div>
                                </div>
                                <div className="flex space-x-2">
                                  <button className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 p-2 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors duration-200">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-sm font-medium">Call</span>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-6 flex flex-wrap gap-3">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors duration-200"
                            >
                              <RotateCcw className="w-4 h-4" />
                              <span>Reorder</span>
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => navigate(`/get-invoice/${order.id}`)}
                              className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                            >
                              <Receipt className="w-4 h-4" />
                              <span>Download Bill</span>
                            </motion.button>
                            {order.orderStatus.toLowerCase() === 'delivered' && (
                              <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                              >
                                <Star className="w-4 h-4" />
                                <span>Rate Order</span>
                              </motion.button>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                            >
                              <MessageSquare className="w-4 h-4" />
                              <span>Help</span>
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </motion.div>

            <div className="max-w-6xl mx-auto p-4 md:p-6">
              {orderHistory.length === 0 && (
                <div className="text-center py-12">
                  <div className="rounded-2xl p-8 max-w-md mx-auto">
                    <div className="w-44 h-44 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <DotLottieReact
                        src="https://lottie.host/975aec3f-1893-40ee-a376-70f7ec36d245/5jF7wAsQ8y.lottie"
                        loop
                        autoplay
                      />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Your Order History is empty</h2>
                    <p className="text-gray-600 mb-6">Looks like you haven't added anything to your History yet</p>
                    <button
                      onClick={() => navigate('/food-section')}
                      className="flex gap-2 justify-center text-orange-400 underline transition-colors font-medium hover:text-orange-500"
                    >
                      Browse Menu <MoveRight className='pt-1' />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </UserCombinedLayout>
    </>
  );
};

export default OrderHistoryPage;