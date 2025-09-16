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
  User,
  Navigation,
  CreditCard,
  DollarSign,
  DollarSignIcon,
  RefreshCcwIcon,
  MoveRight
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { fetchOrderHistory, RePayOption, RePayUpdatePaymentStatus } from '../../Api/userApiCalls/productApi';
import { FaDollarSign, FaFileInvoiceDollar } from 'react-icons/fa';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import toast from 'react-hot-toast';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { useNavigate } from 'react-router-dom';

export interface IOrderHistory {
  _id: string;
  userId: string;
  totalAmount: number;
  orderStatus: string;
  selectedPaymentMethod: string;
  paymentStatus: string;
  orderDate: string; // ISO string from DB

  hotelId: string;
  hotelName: string;
  hotelImage: string;
  hotelEmail: string;
  hotelCity: string;
  hotelPhone: string;

  products: {
    productId: string;
    category: string;
    productName: string;
    price: number;
    quantity: number;      // the stock or available qty
    cartQuantity?: number; // optional if needed
  }[];
}

const OrderHistoryPage = () => {
  const user = useSelector((state: RootState) => state.userProfile)
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [orderHistory, setOrderHistory] = useState<IOrderHistory[]>([])
  const [processingPayment, setProcessingPayment] = useState<string | null>(null);
  const [{ isPending }] = usePayPalScriptReducer();
  const [showPayPalButtons, setShowPayPalButtons] = useState(false);

  const navigate = useNavigate()
  const handleFetchOrderHistory = async () => {
    try {
      const response = await fetchOrderHistory(user._id)
      setOrderHistory(response.orderDetails)
    } catch (error) {
      console.error('Error fetching order history:', error)
    }
  }


  const handleCustomButtonClick = (orderId: string) => {
    handleRepayment(orderId);
    setShowPayPalButtons(true);
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
      console.log(response.payementStatus
        ._id, 'THIS IS STATUS ID');

      if (!response.payementStatus._id) {
        throw new Error("Payment status ID missing in response");
      }

   
      toast.success("Payment updated successfully:");
    } catch (error) {
      console.error("Repayment error:", error);
    } finally {
      setProcessingPayment(null);
    }
  };

  const handleUpdatedStatus = async (orderId:string,payementStatus:string) => {
    try {
         const updatePaymentStatusResponse = await RePayUpdatePaymentStatus(
        orderId,payementStatus
      );


    } catch (error) {
      
    }
  }


  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'cancelled': return 'text-red-600 bg-red-50';
      case 'preparing': return 'text-yellow-600 bg-yellow-50';
      case 'out_for_delivery': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      case 'preparing': return <Package className="w-4 h-4" />;
      case 'out_for_delivery': return <Truck className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
      case 'completed':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'failed':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = filterStatus === 'all'
    ? orderHistory
    : orderHistory.filter(order => order.orderStatus === filterStatus);

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

  useEffect(()=>{
    handleUpdatedStatus
  },[])

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6 lg:px-8">
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
            {['all', 'delivered', 'cancelled', 'preparing', 'out_for_delivery'].map((status) => (
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
              key={order._id}
              variants={itemVariants}
              className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden"
            >

              {/* Order Summary */}
              <div className="p-6">
                {/* Header Row - Hotel Info and Status */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <img
                      src={order.hotelImage}
                      alt={order.hotelName}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{order.hotelName}</h3>
                      <p className="text-sm text-gray-500">Order #{order._id.slice(-6)}</p>
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
                      <span>{order.products.length} items</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CreditCard className="w-4 h-4" />
                      <span className="capitalize">{order.selectedPaymentMethod}</span>
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus === 'failed' ? (
                        <XCircle className="w-3 h-3 mr-1" />
                      ) : order.paymentStatus === 'paid' || order.paymentStatus === 'completed' ? (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      ) : (
                        <Clock className="w-3 h-3 mr-1" />
                      )}
                      <span className="capitalize">{order.paymentStatus}</span>
                    </div>
                  </div>

                  {/* Right side - Actions */}
                  <div className="flex items-center space-x-3">
                    {/* Conditional Re-pay button - shows for failed or pending payments */}
                    {(order.paymentStatus.toLowerCase() === 'failed' || order.paymentStatus.toLowerCase() === 'pending') && (
                      <div>
                        {!showPayPalButtons ? (
                          <button
                            onClick={() => handleCustomButtonClick(order._id)}
                            disabled={processingPayment === order._id}
                            className={`flex items-center space-x-2 ${order.paymentStatus.toLowerCase() === 'failed'
                              ? 'text-red-600 hover:texr-red-700'
                              : 'text-orange-600 hover:text-orange-700'
                              } text-red-600 px-4 py-2 rounded-lg text-sm font-medium transition-all   duration-200 ${processingPayment === order._id ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md'
                              }`}
                          ><RefreshCcwIcon />
                            {processingPayment === order._id ? (
                              <>
                                <svg
                                  className="animate-spin -ml-1 mr-1 h-4 w-4 text-white"
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
                              <>
                            <span>Re-Pay</span>
                              </>
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
                              createOrder={(data, actions) => {
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
                              onApprove={async (data, actions) => {
                                try {
                                  const details = await actions.order?.capture();
                                  console.log("Payment successful:", details);
                                  await RePayUpdatePaymentStatus(order._id, "Paid");

                                  toast.success("Payment successful!");
                                  navigate("/order-history");
                                } catch (err) {
                                  console.error("Error capturing PayPal order:", err);
                                  await RePayUpdatePaymentStatus(order._id, "Failed");
                                  toast.error("Something went wrong while capturing payment.");
                                }
                              }}
                              onError={async (err) => {
                                console.error("PayPal error:", err);
                                await RePayUpdatePaymentStatus(order._id, "Failed");

                                toast.error("Payment failed. Please try again.");
                                setShowPayPalButtons(false);
                              }}
                              onCancel={async () => {
                                console.warn("Payment cancelled by user");
                                await RePayUpdatePaymentStatus(order._id, "Failed");

                                toast.error("Payment cancelled.");
                                setShowPayPalButtons(false);
                              }}

                              />
                          </div>
                        )}
                      </div>

                    )} 


                    {/* View Details button */}
                    <button
                      onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                      className="flex items-center space-x-1 text-amber-600 hover:text-amber-700 font-medium transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-amber-50"
                    >
                      <span>View Details</span>
                      {expandedOrder === order._id ? (
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
                {expandedOrder === order._id && (
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
                          {order.products.map((product) => (
                            <div
                              key={product.productId}
                              className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <Package className="w-6 h-6 text-gray-400" />
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900">{product.productName}</h5>
                                  <p className="text-sm text-gray-600">
                                    Qty: {product.cartQuantity || product.quantity}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center text-gray-900 font-medium">
                                <IndianRupee className="w-4 h-4" />
                                <span>
                                  {Number(product.price) * Number(product.cartQuantity || product.quantity)}
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
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${order.orderStatus === 'delivered' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                              <CheckCircle className="w-4 h-4" />
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium capitalize ${order.orderStatus === 'delivered' ? 'text-gray-900' : 'text-gray-500'}`}>
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
                                {order.paymentStatus === 'failed' ? (
                                  <XCircle className="w-3 h-3 mr-1" />
                                ) : order.paymentStatus === 'paid' || order.paymentStatus === 'completed' ? (
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

                      {/* Hotel Contact */}
                      <div className="mt-6">
                        <h4 className="text-lg font-semibold text-gray-900 mb-3">Hotel Information</h4>
                        <div className="bg-white p-4 rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <img
                                src={order.hotelImage}
                                alt={order.hotelName}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div>
                                <p className="font-medium text-gray-900">{order.hotelName}</p>
                                <p className="text-sm text-gray-600">{order.hotelCity}</p>
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
                          className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                        >
                          <Receipt onClick={()=> navigate('/get-invoice')} className="w-4 h-4" />
                          <span>Download Bill</span>
                        </motion.button>
                        {order.orderStatus === 'delivered' && (
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
              <div className="rounded-2xl p-8  max-w-md mx-auto">
                <div className="w-44 h-44 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DotLottieReact
                    src="https://lottie.host/975aec3f-1893-40ee-a376-70f7ec36d245/5jF7wAsQ8y.lottie"
                    loop
                    autoplay
                  />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Your Order History is empty</h2>
                <p className="text-gray-600 mb-6">Looks like you haven't added anything to your History yet</p>
                <a
                  onClick={() => navigate('/food-section')}
                  className="flex gap-2 justify-center  text-orange-400 underline transition-colors font-medium "
                >
                  Browse Menu <MoveRight className='pt-1' />
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default OrderHistoryPage;