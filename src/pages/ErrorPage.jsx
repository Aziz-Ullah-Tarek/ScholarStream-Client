import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiHome } from 'react-icons/fi';

const ErrorPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#6AECE1] via-[#26CCC2] to-[#6AECE1] px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="mb-8"
        >
          <FiAlertTriangle className="text-[#FFB76C] w-32 h-32 mx-auto drop-shadow-2xl" />
        </motion.div>
        
        <h1 className="text-9xl font-bold bg-gradient-to-r from-[#FFF57E] to-[#FFB76C] bg-clip-text text-transparent mb-4">
          Oops!
        </h1>
        <h2 className="text-3xl font-semibold text-white mb-4 drop-shadow-lg">
          Something Went Wrong
        </h2>
        <p className="text-lg text-white/90 mb-8 drop-shadow">
          An unexpected error occurred. Let's get you back on track!
        </p>
        
        <Link to="/">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-[#26CCC2] px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto"
          >
            <FiHome size={24} />
            Go Back Home
          </motion.button>
        </Link>
      </motion.div>
    </div>
  );
};

export default ErrorPage;
