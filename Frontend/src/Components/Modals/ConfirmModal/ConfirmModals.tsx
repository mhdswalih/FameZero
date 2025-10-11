import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
  isDanger?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
}

const ConfirmModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isLoading = false,
  isDanger = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={onCancel}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className={`p-6 ${isDanger ? 'bg-red-50' : 'bg-blue-50'} border-b border-gray-200`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${isDanger ? 'bg-red-100' : 'bg-blue-100'}`}>
                  <AlertTriangle className={`h-5 w-5 ${isDanger ? 'text-red-600' : 'text-blue-600'}`} />
                </div>
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold ${isDanger ? 'text-red-900' : 'text-blue-900'}`}>
                    {title}
                  </h3>
                </div>
                <button
                  onClick={onCancel}
                  className="p-1 hover:bg-gray-200 rounded-full transition-colors"
                  disabled={isLoading}
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Message */}
            <div className="p-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex gap-3 justify-end">
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isDanger
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isLoading && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                {confirmText}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;