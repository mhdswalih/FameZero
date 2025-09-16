import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    MapPin,
    Clock,
    CreditCard,
    Wallet,
    Truck,
    ShoppingBag,
    User,
    Home,
    Building,
    Plus,
    Check
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import toast from 'react-hot-toast';
import { createOrder, getCheckOut, updatePaymentStatus } from '../../Api/userApiCalls/productApi';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import UserEditModal from '../Modals/User/UserEditModal';
import { addUserProfile } from '../../Redux/Slice/ProfileSlice/userProfileSlice';
import { getUserDetails, updateUser } from '../../Api/userApiCalls/profileApi';
import OrderSuccessModal from '../Modals/User/OrderSuccessModal';

const CheckOutPage = () => {
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.userProfile._id);
    const user = useSelector((state: RootState) => state.userProfile);
    const id = useSelector((state: RootState) => state.user.id);

    interface IProductsDetails {
        cartQuantity: number;
        productDetails: any;
        _id: string;
        productId: string;
        category: string;
        productName: string;
        price: number;
        quantity: number;
    }

    interface userDetails {
        _id: string;
        name: string;
        email: string;
        profilepic: string;
        phone: string;
        address: string;
        city: string;
    }

    interface userEditDetails {
        _id: string;
        name: string;
        email: string;
        profilepic: string;
        phone: string;
        address: string;
        city: string;
    }

    const [userProfile, setUserProfile] = useState<userDetails>({
        _id: '',
        name: '',
        email: '',
        profilepic: '',
        phone: '',
        address: '',
        city: '',
    });

    // State management
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Online' | 'COD'>('Online');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editedProfile, setEditedProfile] = useState<userEditDetails>({ ...userProfile });
    const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<'delivery' | 'takeaway'>('delivery');
    const [checkoutDetails, setCheckOutDetails] = useState<IProductsDetails[]>([]);
    const [orderNotes, setOrderNotes] = useState('');
    const [{ isPending }] = usePayPalScriptReducer();
    const [orderId, setOrderId] = useState<string>('');
    const [isOrderSuccessModal,setIsOrderSuccessModal] = useState(false)
    const dispatch = useDispatch();

    const handleGetUser = async () => {
        try {
            const response = await getUserDetails(id as string);
            if (response.data) {
                const profileData = {
                    _id: response.data._id || '',
                    name: response.data.name || '',
                    email: response.data.email || '',
                    profilepic: response.data.profilepic || '',
                    phone: response.data.phone || '',
                    address: response.data.address || '',
                    city: response.data.city || '',
                };

                setUserProfile(profileData);
                dispatch(addUserProfile(profileData));
                setEditedProfile((prev: any) => ({
                    ...prev,
                    ...profileData,
                }));
            }
        } catch (error: any) {
            toast.error(error.error);
        }
    };


    const handleEditUser = async (selectedFile?: File) => {
        try {
            const response = await updateUser(id as string, editedProfile, selectedFile);
            if (response.data) {
                const updatedProfile: userDetails = {
                    _id: response.data._id || editedProfile._id,
                    name: response.data.name || editedProfile.name,
                    email: response.data.email || editedProfile.email,
                    profilepic: response.data.profilepic || editedProfile.profilepic,
                    phone: response.data.phone || editedProfile.phone,
                    address: response.data.address || editedProfile.address,
                    city: response.data.city || editedProfile.city,
                };

                setUserProfile(updatedProfile);
                dispatch(addUserProfile(updatedProfile));

                toast.success('Profile updated successfully');
                setIsEditModalOpen(false);
            }
        } catch (error: any) {
            toast.error(error.message || error.error || 'Failed to update profile');
        }
    };

    const handleGetCheckOut = async () => {
        try {
            const response = await getCheckOut(userId);
            const checkOutArray = response?.checkOutDetails;
            if (Array.isArray(checkOutArray) && checkOutArray.length > 0) {
                const cart = checkOutArray[0];
                if (Array.isArray(cart.products) && cart.products.length > 0) {
                    const formattedProducts = cart.products.map((product: IProductsDetails) => ({
                        category: product.productDetails?.category || '',
                        productName: product.productDetails?.productName || '',
                        price: product.productDetails?.price || 0,
                        quantity: product.productDetails?.quantity || 0,
                        cartItemId: product._id,
                        productId: product.productId,
                        cartQuantity: product.cartQuantity
                    }));
                    setCheckOutDetails(formattedProducts);
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch checkout details");
        }
    };

    const handleupdatePaymentStatus = async (
        orderId: string,
        paymentStatus: string,
        paypalOrderId?: string
    ) => {
        try {
            await updatePaymentStatus(orderId, paymentStatus, paypalOrderId);
        } catch (error: any) {
            toast.error(error.response?.data || error.message);
        }
    };

    const calculateSubtotal = () => {
        return checkoutDetails.reduce((total, item) => {
            return total + (item.price * item.cartQuantity);
        }, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const deliveryFee = selectedDeliveryOption === 'delivery' ? 3.99 : 0;
        return subtotal + deliveryFee;
    };

    const handleCashOrder = async () => {
        try {
            if (!user.name || !user.phone) {
                toast.error("Please fill in your contact information");
                return;
            }

            if (selectedDeliveryOption === "delivery" && !user.address) {
                toast.error("Please select a delivery address");
                return;
            }

            // For cash orders, use "COD" instead of "Online"
            const orderResponse = await createOrder(userId, "COD", selectedDeliveryOption);
            if (orderResponse.status === 200) {
                toast.success("Order placed successfully!");
                setIsOrderSuccessModal(true)
                navigate('/order-history', {
                    state: {
                        orderId: orderResponse.orderId,
                        orderDetails: {
                            items: checkoutDetails,
                            total: calculateTotal(),
                            paymentMethod: "Cash on Delivery",
                            deliveryOption: selectedDeliveryOption
                        }
                    }
                });
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to place order");
        }
    };

    const handleEdit = () => {
        setIsEditModalOpen(true);
    };

    useEffect(() => {
        if (userId) {
            handleGetCheckOut();
        }
    }, [userId]);

    useEffect(() => {
        if (id) {
            handleGetUser();
        }
    }, [id]);
 

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-orange-100 pb-20">
            {/* Header */}
            <div className="bg-white shadow-sm py-5 px-4 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <motion.div
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate(-1)}
                        className="cursor-pointer flex items-center text-orange-600 hover:text-orange-800 transition-colors"
                    >
                        <ChevronLeft className="h-6 w-6 mr-1" />
                        <span className="text-base font-medium">Back to Cart</span>
                    </motion.div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Checkout</h1>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-4 md:p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Side - Checkout Form */}
                    <div className="lg:w-2/3 space-y-6">
                        <button 
                            disabled={!!user.address} 
                            onClick={handleEdit}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                user.address 
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                                    : 'bg-orange-500 text-white hover:bg-orange-600'
                            }`}
                        >
                            {user.address ? 'Address Added' : 'Add Address'}
                        </button>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Truck className="w-5 h-5 text-orange-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Delivery Option</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <motion.div
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedDeliveryOption('delivery')}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedDeliveryOption === 'delivery'
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <Truck className="w-6 h-6 text-orange-600" />
                                            <h3 className="font-semibold text-gray-900">Home Delivery</h3>
                                        </div>
                                        {selectedDeliveryOption === 'delivery' && (
                                            <Check className="w-5 h-5 text-orange-600" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">Delivered to your doorstep</p>
                                    <p className="text-orange-600 font-medium">+ $5.99</p>
                                </motion.div>

                                <motion.div
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedDeliveryOption('takeaway')}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedDeliveryOption === 'takeaway'
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <ShoppingBag className="w-6 h-6 text-orange-600" />
                                            <h3 className="font-semibold text-gray-900">Takeaway</h3>
                                        </div>
                                        {selectedDeliveryOption === 'takeaway' && (
                                            <Check className="w-5 h-5 text-orange-600" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">Pick up from restaurant</p>
                                    <p className="text-green-600 font-medium">Free</p>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Address Selection - Only show for delivery */}
                        {selectedDeliveryOption === 'delivery' && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-white rounded-2xl p-6 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                            <MapPin className="w-5 h-5 text-orange-600" />
                                        </div>
                                        <h2 className="text-xl font-bold text-gray-900">Delivery Address</h2>
                                    </div>
                                </div>

                                {/* Saved Addresses */}
                                <div className="space-y-3 mb-4">
                                    {user.address && (
                                        <motion.div
                                            whileTap={{ scale: 0.95 }}
                                            className="p-4 rounded-xl border-2 border-orange-500 bg-orange-50 cursor-pointer transition-all"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mt-0.5">
                                                        <MapPin className="w-4 h-4 text-orange-600" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">Current Address</h3>
                                                        <p className="text-gray-600 text-sm">{user.address}, {user.city}</p>
                                                    </div>
                                                </div>
                                                <Check className="w-5 h-5 text-orange-600" />
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Payment Methods */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white rounded-2xl p-6 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <CreditCard className="w-5 h-5 text-orange-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Payment Method</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <motion.div
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedPaymentMethod('Online')}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPaymentMethod === 'Online'
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-6 h-6 text-orange-600" />
                                            <h3 className="font-semibold text-gray-900">Online Payment</h3>
                                        </div>
                                        {selectedPaymentMethod === 'Online' && (
                                            <Check className="w-5 h-5 text-orange-600" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">Pay with Card/UPI/Wallet</p>
                                    <p className="text-green-600 font-medium text-sm">Secure & Fast</p>
                                </motion.div>

                                <motion.div
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedPaymentMethod('COD')}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPaymentMethod === 'COD'
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <Wallet className="w-6 h-6 text-orange-600" />
                                            <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
                                        </div>
                                        {selectedPaymentMethod === 'COD' && (
                                            <Check className="w-5 h-5 text-orange-600" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">Pay when you receive</p>
                                    <p className="text-blue-600 font-medium text-sm">Cash Payment</p>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Order Notes */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white rounded-2xl p-6 shadow-sm"
                        >
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Special Instructions</h2>
                            <textarea
                                value={orderNotes}
                                onChange={(e) => setOrderNotes(e.target.value)}
                                placeholder="Add any special instructions for your order (optional)"
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                            />
                        </motion.div>
                    </div>

                    {/* Right Side - Order Summary */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                            {/* Product List */}
                            <div className="mb-4 max-h-60 overflow-y-auto">
                                {checkoutDetails.map((item, index) => (
                                    <div key={index} className="flex justify-between items-start py-2 border-b border-gray-100 last:border-b-0">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900 truncate">{item.productName}</p>
                                            <p className="text-xs text-gray-500">{item.category}</p>
                                        </div>
                                        <div className="text-right ml-2">
                                            <p className="text-sm font-medium text-gray-900">
                                                {item.cartQuantity} × ${item.price}
                                            </p>
                                            <p className="text-sm font-semibold text-orange-600">
                                                ${(item.price * item.cartQuantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Items ({checkoutDetails.length})</span>
                                    <span className="font-medium">${calculateSubtotal().toFixed(2)}</span>
                                </div>

                                {selectedDeliveryOption === 'delivery' && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Delivery Fee</span>
                                        <span className="font-medium">${3.99}</span>
                                    </div>
                                )}

                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-orange-600">${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Estimated Time */}
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                                <Clock className="w-4 h-4" />
                                <span>
                                    Estimated {selectedDeliveryOption === 'delivery' ? 'delivery' : 'pickup'} time: 25-35 mins
                                </span>
                            </div>

                            {selectedPaymentMethod === "Online" && (
                                <PayPalButtons
                                    style={{
                                        layout: "vertical",
                                        color: "gold",
                                        shape: "rect",
                                        label: "paypal"
                                    }}
                                    disabled={isPending || !user.name || !user.phone ||
                                        (selectedDeliveryOption === "delivery" && !user.address)}
                                    createOrder={async (data, actions) => {
                                        try {
                                            const orderResponse = await createOrder(
                                                userId,
                                                selectedPaymentMethod,
                                                selectedDeliveryOption
                                            );                                    
                                            setOrderId(orderResponse.orderId);
                                            const paypalOrderId = await actions.order.create({
                                                purchase_units: [
                                                    {
                                                        amount: {
                                                            currency_code: "USD",
                                                            value: calculateTotal().toFixed(2),
                                                        },
                                                        custom_id: orderResponse.orderId,
                                                        description: `Order for ${checkoutDetails.length} items`,
                                                    },
                                                ],
                                                intent: "CAPTURE",
                                            });
                                            return paypalOrderId;
                                        } catch (err) {
                                            toast.error("Failed to create PayPal order");
                                            throw err;
                                        }
                                    }}
                                    onApprove={async (data) => {
                                        try {
                                            const paypalOrderId = data.orderID;
                                            handleupdatePaymentStatus(orderId, "Paid", paypalOrderId);
                                            toast.success("Payment successful!");
                                                navigate("/order-history", {
                                                    state: {
                                                        orderId: orderId,
                                                        orderDetails: {
                                                            items: checkoutDetails,
                                                            total: calculateTotal(),
                                                            paymentMethod: 'PayPal',
                                                            deliveryOption: selectedDeliveryOption,
                                                        },
                                                    },
                                                });
                                        } catch (err) {
                                            toast.error("Payment failed. Please try again.");
                                        }
                                    }}
                                    onError={(error) => {
                                        toast.error("PayPal error occurred. Please try again." + error);
                                    }}
                                    onCancel={(data) => {
                                        toast.error("Payment was cancelled" + data);
                                    }}
                                />
                            )}

                            {selectedPaymentMethod === 'COD' && (
                                <button
                                    onClick={handleCashOrder}
                                    disabled={!user.name || !user.phone || (selectedDeliveryOption === "delivery" && !user.address)}
                                    className="bg-orange-500 text-white w-full py-4 rounded-xl hover:bg-orange-600 transition-colors font-medium text-lg shadow-md disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    Place Order • ${calculateTotal().toFixed(2)}
                                </button>
                            )}

                            <p className="text-xs text-gray-500 text-center mt-3">
                                By placing this order, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <UserEditModal
                isEditModalOpen={isEditModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                userProfile={userProfile}
                setUserProfile={setUserProfile}
                editedProfile={editedProfile}
                setEditedProfile={setEditedProfile}
                handleEditUser={handleEditUser}
            />
            <OrderSuccessModal
             onClose={()=>setIsOrderSuccessModal(false)}
             open={isOrderSuccessModal}
             orderId={orderId}
             
            />
        </div>
    );
};

export default CheckOutPage;