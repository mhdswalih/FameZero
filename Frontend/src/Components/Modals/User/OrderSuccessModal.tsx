import { useEffect } from 'react';
import handGif from '../../../../img/hand-waving-hand.gif';

interface OrderSuccessInterface {
  open: boolean;
  onClose: () => void;
  orderId: string;
  deliveryTime?: string;
}

const OrderSuccessModal = ({ open, onClose, orderId}: OrderSuccessInterface) => {
  useEffect(() => {
    if(open) {
      const time = setTimeout(() => {
        onClose()
      }, 5000) 
      return () => clearTimeout(time)
    }
  }, [open, onClose])

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Background Blur Overlay */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
        style={{
          backdropFilter: 'blur(10px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(10px) saturate(1.2)'
        }}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl border-4 border-green-400 max-w-md mx-4 overflow-hidden animate-bounce-in">
        {/* Header with Green Background */}
        <div className="bg-gradient-to-r from-green-400 to-green-500 px-8 py-6 text-center">
          {/* Food Icons */}
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">✅</span>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🍕</span>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🚚</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            Order Confirmed! 🎉
          </h2>
          <p className="text-green-100">
            Your delicious food is on its way
          </p>
        </div>
        
        {/* Content Area */}
        <div className="bg-white px-8 py-6 text-center">
          {/* Order Details */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <p className="text-gray-700 mb-2">
              <span className="font-semibold">Order ID:</span> #{orderId}
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Estimated Delivery:</span> {}
            </p>
          </div>
          
          {/* Hand Gif with Green Theme */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center shadow-inner p-2">
              <img src={handGif} alt="Success" className="w-20 h-20 object-contain" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Thank you for your order! 🎊
          </h3>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            We've received your order and our chef is already preparing your delicious meal.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-green-400 to-green-500 text-white py-3 px-6 rounded-full font-semibold hover:from-green-500 hover:to-green-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Track My Order 📱
            </button>
            <button
              onClick={onClose}
              className="w-full bg-white text-green-500 border border-green-400 py-3 px-6 rounded-full font-semibold hover:bg-green-50 transition-all duration-300"
            >
              Continue Browsing 🍔
            </button>
          </div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-green-300 rounded-full animate-ping"></div>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </div>
        
        {/* Confetti Animation (optional) */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-2xl opacity-70"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `confetti-fall ${Math.random() * 3 + 2}s linear forwards`,
                animationDelay: `${Math.random() * 1}s`,
                transform: `rotate(${Math.random() * 360}deg)`
              }}
            >
              {['🎉', '🎊', '✅', '🍕', '🍔', '🍟', '🎈'][i % 7]}
            </div>
          ))}
        </div>
        
        {/* Add CSS for confetti animation */}
        <style>
          {`
            @keyframes confetti-fall {
              0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
              100% { transform: translateY(500px) rotate(360deg); opacity: 0; }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default OrderSuccessModal;