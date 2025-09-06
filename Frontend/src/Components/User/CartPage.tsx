import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, Minus, Trash2, ChefHat, Cookie, Coffee, Salad, Sandwich, Pizza, Fish, Drumstick, Beef, Leaf, IceCream, Wine, Star, Baby, MoveRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/store';
import { fetchCartProduct, removeCart, updateStockInCart } from '../../Api/userApiCalls/productApi';
import toast from 'react-hot-toast';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
const CartPage = () => {
    const navigate = useNavigate();
    interface IProductsDetails {
        _id: string;
        productId: string;
        category: string,
        productName: string,
        price: string,
        quantity: string
    }
    const [cartItems, setCartItems] = useState<IProductsDetails[]>([])
    const [cartQuantity, setCartQuantity] = useState(0)
    const userId = useSelector((state: RootState) => state.userProfile._id)
    const handleFetchCartItems = async () => {
        try {
            const response = await fetchCartProduct(userId)
            if (Array.isArray(response?.data.products)) {
                const products = response.data.products.map((p: {
                    quantity: string;
                    _id: string; productId: string, productDetails: IProductsDetails
                }) => ({
                    ...p.productDetails,
                    _id: p._id,
                    productId: p.productId,
                    cartQuantity: p.quantity
                }));
                if (Array.isArray(products)) products.map((p) => setCartQuantity(p.cartQuantity))
                setCartItems(products);
            } else {
                setCartItems([])
            }
        } catch (error) {

        }
    }

 const updateStock = async (productId: string, action: "increment" | "decrement") => {
    try {
        const response = await updateStockInCart(userId, productId, action);

        // Update cart items with new quantity
        setCartItems(prev =>
            prev.map(item =>
                item.productId === productId
                    ? { ...item, quantity: response.updatedQuantity }
                    : item
            )
        );

        setCartQuantity ( prev => action === "increment" ? prev + 1 : prev - 1)
    } catch (error: any) {
        toast.error(
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Something went wrong"
        );
    }
};


    const handleRemovefromCart = async (productId: string) => {
        try {
            const response = await removeCart(productId, userId)
            setCartItems(prevItems => prevItems.filter(item => item.productId !== productId));
            toast.success(response.data.message || "Removed from cart");

        } catch (error) {

        }
    }

    const ProductCategories = [
        { value: "", label: "All Categories", icon: ChefHat },
        { value: "Appetizers", label: "Appetizers", icon: Cookie },
        { value: "Main Course", label: "Main Course", icon: ChefHat },
        { value: "Soups", label: "Soups", icon: Coffee },
        { value: "Salads", label: "Salads", icon: Salad },
        { value: "Sandwiches", label: "Sandwiches", icon: Sandwich },
        { value: "Burgers", label: "Burgers", icon: Sandwich },
        { value: "Pizza", label: "Pizza", icon: Pizza },
        { value: "Pasta", label: "Pasta", icon: ChefHat },
        { value: "Seafood", label: "Seafood", icon: Fish },
        { value: "Chicken", label: "Chicken", icon: Drumstick },
        { value: "Beef", label: "Beef", icon: Beef },
        { value: "Vegetarian", label: "Vegetarian", icon: Leaf },
        { value: "Vegan", label: "Vegan", icon: Leaf },
        { value: "Sides", label: "Sides", icon: Cookie },
        { value: "Desserts", label: "Desserts", icon: IceCream },
        { value: "Beverages", label: "Beverages", icon: Coffee },
        { value: "Hot Drinks", label: "Hot Drinks", icon: Coffee },
        { value: "Cold Drinks", label: "Cold Drinks", icon: Coffee },
        { value: "Alcoholic Beverages", label: "Alcoholic Beverages", icon: Wine },
        { value: "Specials", label: "Specials", icon: Star },
        { value: "Kids Menu", label: "Kids Menu", icon: Baby },
    ];

    useEffect(() => {
        if (userId) {
            handleFetchCartItems()
        }
    }, [userId])



    const getCategoryIcon = (category: string) => {
        const categoryObj = ProductCategories.find(cat => cat.value === category);
        return categoryObj ? categoryObj.icon : ChefHat;
    };

    // Calculate order totals
    const calculateOrderTotals = () => {
        const subtotal = cartItems.reduce((total, item) => {
             let price =  Number(item.price) || 0
             let quantity = Number(cartQuantity) || 0
             return total = price * quantity
        }, 0);

       
        const total = subtotal ;

        return {
            subtotal: subtotal.toFixed(2),
            total: total.toFixed(2)
        };
    };

    const { subtotal, total } = calculateOrderTotals();

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
                        <span className="text-base font-medium">Back</span>
                    </motion.div>

                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Cart</h1>

                    <div className="w-6"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-4 md:p-6">
                {cartItems.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="rounded-2xl p-8  max-w-md mx-auto">
                            <div className="w-44 h-44 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <DotLottieReact
                                    src="https://lottie.host/975aec3f-1893-40ee-a376-70f7ec36d245/5jF7wAsQ8y.lottie"
                                    loop
                                    autoplay
                                />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet</p>
                            <a
                                onClick={() => navigate('/food-section')}
                                className="flex gap-2 justify-center  text-orange-400 underline transition-colors font-medium "
                            >
                                Browse Menu <MoveRight className='pt-1' />
                            </a>
                        </div>
                    </div>
                ) : (
                    // Fixed: Added flex container to position items side by side
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Cart Items - Left Side */}
                        <div className="lg:w-2/3 space-y-4">
                            {cartItems.map((item) => {
                                const IconComponent = getCategoryIcon(item.category);

                                return (
                                    <motion.div
                                        key={item._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-4"
                                    >
                                        <div className="w-20 h-20 md:w-24 md:h-24 bg-orange-100 flex items-center justify-center rounded-xl">
                                            <IconComponent size={32} className="text-orange-600" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="text-lg font-medium text-gray-900">{item.productName}</h3>
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                    {item.category}
                                                </span>
                                            </div>
                                            <p className="text-orange-600 font-semibold">${item.price}</p>

                                            <div className="flex items-center justify-between mt-3">
                                                <div className="flex items-center space-x-3">
                                                    <button
                                                        onClick={() => updateStock(item.productId, 'decrement')}
                                                        className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="text-gray-700 font-medium w-6 text-center">{cartQuantity}</span>
                                                    {Number(item.quantity) !== 0 && (
                                                        <button
                                                            onClick={() => updateStock(item.productId, 'increment')}
                                                            className="w-8 h-8 flex items-center justify-center bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                                                        >

                                                            <Plus size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                                <button
                                                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                                                >
                                                    <Trash2 size={18} onClick={() => handleRemovefromCart(item.productId)} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Order Summary - Right Side */}
                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm sticky top-24">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span className="font-medium">${subtotal}</span>
                                    </div>
                                  
                                  
                                    <div className="border-t pt-3 mt-3">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total</span>
                                            <span className="text-orange-600">${total}</span>
                                        </div>
                                    </div>
                                </div>

                                <button className="bg-orange-500 text-white w-full py-4 rounded-xl hover:bg-orange-600 transition-colors font-medium text-lg shadow-md">
                                    Proceed to Checkout
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CartPage;