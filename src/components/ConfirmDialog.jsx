import { motion, AnimatePresence } from 'framer-motion';

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />

        {/* Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-4 border-2 border-[#6AECE1]"
        >
          {/* Title */}
          <h3 className="text-2xl font-bold bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] bg-clip-text text-transparent mb-4">
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-700 mb-6">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              className="btn btn-outline border-2 border-gray-300 hover:bg-gray-100 text-gray-700 rounded-xl"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="btn bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-xl shadow-lg"
            >
              {confirmText}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ConfirmDialog;
