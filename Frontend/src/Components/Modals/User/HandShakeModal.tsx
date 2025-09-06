import { useEffect } from 'react';
import handGif from '../../../../img/hand-waving-hand.gif';

interface HandShakeInterface {
  open: boolean;
  onClose: () => void
  name: string
}

const HandShakeModal = ({ open, onClose, name }: HandShakeInterface) => {
  useEffect(() => {
    if(open) {
      const time = setTimeout(() => {
        onClose()
      }, 4000) 
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
      <div className="relative bg-white rounded-3xl shadow-2xl border-4 border-orange-400 max-w-md mx-4 overflow-hidden animate-bounce-in">
        {/* Header with Orange Background */}
        <div className="bg-gradient-to-r from-orange-400 to-orange-500 px-8 py-6 text-center">
          {/* Food Icons */}
          <div className="flex justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🍕</span>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🍔</span>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">🍜</span>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-white mb-2">
            Welcome{name ? ` ${name}` : ''}! 🎉
          </h2>
          <p className="text-orange-100">
            Delicious food awaits you
          </p>
        </div>
        
        {/* Content Area */}
        <div className="bg-white px-8 py-6 text-center">
          {/* Hand Gif with Orange Theme */}
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center shadow-inner p-2">
              <img src={handGif} alt="Handshake" className="w-20 h-20 object-contain" />
            </div>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Great to have you here! 👋
          </h3>
          
          <p className="text-gray-600 mb-6 leading-relaxed">
            Ready to explore amazing cuisines and discover the best restaurants?
          </p>
          
          {/* Action Button */}
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-orange-400 to-orange-500 text-white py-3 px-6 rounded-full font-semibold hover:from-orange-500 hover:to-orange-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Start Exploring 🚀
          </button>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute top-4 right-4">
          <div className="w-3 h-3 bg-orange-300 rounded-full animate-ping"></div>
        </div>
        <div className="absolute bottom-4 left-4">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default HandShakeModal;