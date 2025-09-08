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
    Phone,
    Mail,
    Home,
    Building,
    Plus,
    Check
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import toast from 'react-hot-toast';
import { createOrder, getCheckOut } from '../../Api/userApiCalls/productApi';

const CheckOutPage = () => {
    const navigate = useNavigate();
    const userId = useSelector((state: RootState) => state.userProfile._id);
    const user = useSelector((state: RootState) => state.userProfile);
    
    interface IProductsDetails {
        cartQuantity: number;
        productDetails: any;
        _id: string;
        productId: string;
        category: string,
        productName: string,
        price: number,
        quantity: number
    }

    // State management
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'online' | 'cash'>('online');
    const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<'delivery' | 'takeaway'>('delivery');
    const [checkoutDetails, setCheckOutDetails] = useState<IProductsDetails[]>([]);
    const [selectedAddress, setSelectedAddress] = useState<string>('');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [orderNotes, setOrderNotes] = useState('');

    // Form states - Pre-fill with user data
    const [contactInfo, setContactInfo] = useState({
        name: user.name || '',
        phone: user.phone || '',
    });

    const [newAddress, setNewAddress] = useState({
        type: 'home',
        street: user.address || '',
        city: user.city || '',
        state: '',
        zipCode: '',
        landmark: ''
    });

    // Sample saved addresses - Pre-fill with user data
    const [savedAddresses, setSavedAddresses] = useState([
        {
            id: '1',
            type: 'home',
            name: `${user.name}'s Address`,
            address: user.address || '',
            city: user.city || '',
            landmark: ''
        },
    ]);

    // Set selected address to the first one by default
    useEffect(() => {
        if (savedAddresses.length > 0) {
            setSelectedAddress(savedAddresses[0].id);
        }
    }, []);

    const handleAddAddress = () => {
        if (!newAddress.street || !newAddress.city) {
            toast.error('Please fill in all required address fields');
            return;
        }

        const addressToAdd = {
            id: Date.now().toString(),
            type: newAddress.type,
            name: `${newAddress.type === 'home' ? 'Home' : newAddress.type === 'work' ? 'Work' : 'Other'} Address`,
            address: newAddress.street,
            city: newAddress.city,
            state: newAddress.state,
            zipCode: newAddress.zipCode,
            landmark: newAddress.landmark
        };

        setSavedAddresses(prev => [...prev, addressToAdd]);
        setSelectedAddress(addressToAdd.id);
        setShowAddressForm(false);
        setNewAddress({
            type: 'home',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            landmark: ''
        });
        toast.success('Address added successfully!');
    };

    const handleGetCheckOut = async () => {
        try {
            const response = await getCheckOut(userId);
            console.log(response, "this is response ...............");

            const checkOutArray = response?.checkOutDetails;
            console.log(checkOutArray, "checkout array");

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
                        cartQuantity: product.quantity
                    }));

                    setCheckOutDetails(formattedProducts);
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to fetch checkout details");
        }
    };

    const handlePlaceOrder = async() => {
       try {

        const response = await createOrder(userId as string)

         if (!contactInfo.name || !contactInfo.phone) {
            toast.error('Please fill in your contact information');
            return;
        }

        if (selectedDeliveryOption === 'delivery' && !selectedAddress) {
            toast.error('Please select a delivery address');
            return;
        }
        
        

        toast.success('Order placed successfully!');
        navigate('/order-confirmation');
       } catch (error) {
        
       }
    };

    const calculateSubtotal = () => {
        return checkoutDetails.reduce((total, item) => {
            return total + (item.price * item.cartQuantity);
        }, 0);
    };

    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const deliveryFee = selectedDeliveryOption === 'delivery' ? 5.99 : 0;
        return subtotal + deliveryFee;
    };

    const deliveryFee = 5.99;

    useEffect(() => {
        if (userId) {
            handleGetCheckOut();
        }
    }, [userId]);

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

                    <div className="w-6"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-4 md:p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Left Side - Checkout Form */}
                    <div className="lg:w-2/3 space-y-6">
                        {/* Contact Information */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-6 shadow-sm"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-orange-600" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                    <input
                                        type="text"
                                        value={contactInfo.name}
                                        onChange={(e) => setContactInfo(prev => ({ ...prev, name: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                                    <input
                                        type="tel"
                                        value={contactInfo.phone}
                                        onChange={(e) => setContactInfo(prev => ({ ...prev, phone: e.target.value }))}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        placeholder="+91 XXXXX XXXXX"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Delivery Options */}
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
                                    <p className="text-orange-600 font-medium">+ $3.99</p>
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
                                    <button
                                        onClick={() => setShowAddressForm(true)}
                                        className="flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
                                    >
                                        <Plus className="w-4 h-4" />
                                        Add New
                                    </button>
                                </div>

                                {/* Saved Addresses */}
                                <div className="space-y-3 mb-4">
                                    {savedAddresses.map((address) => (
                                        <motion.div
                                            key={address.id}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setSelectedAddress(address.id)}
                                            className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress === address.id
                                                ? 'border-orange-500 bg-orange-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start gap-3">
                                                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-0.5">
                                                        {address.type === 'home' ? (
                                                            <Home className="w-4 h-4 text-gray-600" />
                                                        ) : address.type === 'work' ? (
                                                            <Building className="w-4 h-4 text-gray-600" />
                                                        ) : (
                                                            <MapPin className="w-4 h-4 text-gray-600" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-gray-900">{address.name}</h3>
                                                        <p className="text-gray-600 text-sm">{address.address}, {address.city}</p>
                                                        {address.landmark && (
                                                            <p className="text-gray-500 text-sm">Landmark: {address.landmark}</p>
                                                        )}
                                                    </div>
                                                </div>
                                                {selectedAddress === address.id && (
                                                    <Check className="w-5 h-5 text-orange-600 mt-0.5" />
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Add New Address Form */}
                                {showAddressForm && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        className="border-t pt-4 space-y-4"
                                    >
                                        <h3 className="font-semibold text-gray-900">Add New Address</h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
                                                <select
                                                    value={newAddress.type}
                                                    onChange={(e) => setNewAddress(prev => ({ ...prev, type: e.target.value }))}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                >
                                                    <option value="home">Home</option>
                                                    <option value="work">Work</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                                <input
                                                    type="text"
                                                    value={newAddress.street}
                                                    onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter street address"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                                <input
                                                    type="text"
                                                    value={newAddress.city}
                                                    onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter city"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                                <input
                                                    type="text"
                                                    value={newAddress.state}
                                                    onChange={(e) => setNewAddress(prev => ({ ...prev, state: e.target.value }))}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter state"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
                                                <input
                                                    type="text"
                                                    value={newAddress.zipCode}
                                                    onChange={(e) => setNewAddress(prev => ({ ...prev, zipCode: e.target.value }))}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter ZIP code"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Landmark (Optional)</label>
                                                <input
                                                    type="text"
                                                    value={newAddress.landmark}
                                                    onChange={(e) => setNewAddress(prev => ({ ...prev, landmark: e.target.value }))}
                                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    placeholder="Enter landmark"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3">
                                            <button
                                                onClick={handleAddAddress}
                                                className="px-6 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-colors font-medium"
                                            >
                                                Add Address
                                            </button>
                                            <button
                                                onClick={() => setShowAddressForm(false)}
                                                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
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
                                    onClick={() => setSelectedPaymentMethod('online')}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPaymentMethod === 'online'
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <CreditCard className="w-6 h-6 text-orange-600" />
                                            <h3 className="font-semibold text-gray-900">Online Payment</h3>
                                        </div>
                                        {selectedPaymentMethod === 'online' && (
                                            <Check className="w-5 h-5 text-orange-600" />
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-600">Pay with Card/UPI/Wallet</p>
                                    <p className="text-green-600 font-medium text-sm">Secure & Fast</p>
                                </motion.div>

                                <motion.div
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setSelectedPaymentMethod('cash')}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPaymentMethod === 'cash'
                                        ? 'border-orange-500 bg-orange-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-3">
                                            <Wallet className="w-6 h-6 text-orange-600" />
                                            <h3 className="font-semibold text-gray-900">Cash on Delivery</h3>
                                        </div>
                                        {selectedPaymentMethod === 'cash' && (
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
                                        <span className="font-medium">${deliveryFee.toFixed(2)}</span>
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

                            <button
                                onClick={handlePlaceOrder}
                                className="bg-orange-500 text-white w-full py-4 rounded-xl hover:bg-orange-600 transition-colors font-medium text-lg shadow-md"
                            >
                                Place Order • ${calculateTotal().toFixed(2)}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-3">
                                By placing this order, you agree to our Terms of Service and Privacy Policy
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckOutPage;