import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Star, Plus } from 'lucide-react';

const WishListPage = () => {
    const navigate = useNavigate();
    
    // Sample wishlist data
    const wishlistItems = [
        {
            id: 1,
            name: "Chicken Briyani",
            price: 12.99,
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=400&h=300&fit=crop",
            category: "Main Course"
        },
        {
            id: 2,
            name: "Butter Chicken",
            price: 14.50,
            rating: 4.5,
            image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
            category: "Main Course"
        },
        {
            id: 3,
            name: "Chocolate Lava Cake",
            price: 6.99,
            rating: 4.9,
            image: "https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?w=400&h=300&fit=crop",
            category: "Dessert"
        },
        {
            id: 4,
            name: "Mango Lassi",
            price: 4.50,
            rating: 4.7,
            image: "https://images.unsplash.com/photo-1571877227207-296f96e14c59?w=400&h=300&fit=crop",
            category: "Beverage"
        }
    ];

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
                    
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Your Wishlist</h1>
                    
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <Heart className="h-5 w-5 text-orange-600" fill="currentColor" />
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto p-4 md:p-6">
                {wishlistItems.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="bg-white rounded-2xl p-8 shadow-sm max-w-md mx-auto">
                            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Heart className="h-12 w-12 text-orange-500" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                            <p className="text-gray-600 mb-6">Start saving your favorite items for later</p>
                            <button 
                                onClick={() => navigate('/menu')}
                                className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors font-medium w-full"
                            >
                                Browse Menu
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="mb-6">
                            <p className="text-gray-700">
                                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} in your wishlist
                            </p>
                        </div>

                        {/* Wishlist Items Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {wishlistItems.map((item) => (
                                <motion.div 
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="relative">
                                        <img 
                                            src={item.image} 
                                            alt={item.name} 
                                            className="w-full h-48 object-cover"
                                        />
                                        <button className="absolute top-3 right-3 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-orange-50 transition-colors">
                                            <Heart className="h-5 w-5 text-orange-600" fill="currentColor" />
                                        </button>
                                        <div className="absolute bottom-3 left-3">
                                            <span className="bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                            <span className="text-orange-600 font-semibold">${item.price.toFixed(2)}</span>
                                        </div>
                                        
                                        <div className="flex items-center mb-4">
                                            <div className="flex items-center mr-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star 
                                                        key={i}
                                                        className={`h-4 w-4 ${i < Math.floor(item.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                                    />
                                                ))}
                                            </div>
                                            <span className="text-sm text-gray-600">{item.rating}</span>
                                        </div>
                                        
                                        <button className="w-full bg-orange-500 text-white py-2 rounded-xl hover:bg-orange-600 transition-colors font-medium flex items-center justify-center gap-2">
                                            <Plus size={18} />
                                            Add to Cart
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WishListPage;