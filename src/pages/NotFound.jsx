import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiHome, FiSearch, FiArrowLeft } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6AECE1] via-[#26CCC2] to-[#6AECE1] flex items-center justify-center px-4 overflow-hidden relative">
      {/* Animated Background Circles */}
      <motion.div
        className="absolute top-20 left-20 w-64 h-64 bg-[#FFF57E] rounded-full opacity-20 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-96 h-96 bg-[#FFB76C] rounded-full opacity-20 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -30, 0],
          y: [0, -50, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Main Content */}
      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* 404 Animation */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <motion.h1
            className="text-[180px] md:text-[250px] font-extrabold leading-none"
            style={{
              background: 'linear-gradient(135deg, #FFF57E 0%, #FFB76C 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 10px 40px rgba(0,0,0,0.1)',
            }}
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            404
          </motion.h1>
        </motion.div>

        {/* Animated Search Icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <motion.div
            className="bg-white/90 backdrop-blur-sm p-6 rounded-full shadow-2xl"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FiSearch className="text-[#26CCC2]" size={64} />
          </motion.div>
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            Oops! Page Not Found
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-2 drop-shadow">
            The page you're looking for seems to have vanished into the digital void.
          </p>
          <p className="text-lg text-white/80 drop-shadow">
            Don't worry, even the best explorers get lost sometimes! 🧭
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-[#26CCC2] px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center"
            >
              <FiHome size={24} />
              Go Home
            </motion.button>
          </Link>
          
          <Link to="/scholarships">
            <motion.button
              whileHover={{ scale: 1.05, y: -3 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#FFB76C] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 min-w-[200px] justify-center"
            >
              <FiSearch size={24} />
              Browse Scholarships
            </motion.button>
          </Link>
        </motion.div>

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8"
        >
          <button
            onClick={() => window.history.back()}
            className="text-white/90 hover:text-white flex items-center gap-2 mx-auto hover:gap-3 transition-all duration-300 text-lg font-semibold drop-shadow"
          >
            <FiArrowLeft size={20} />
            Go Back
          </button>
        </motion.div>

        {/* Floating Elements */}
        <motion.div
          className="absolute top-1/4 left-10 text-6xl"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, -15, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🎓
        </motion.div>
        <motion.div
          className="absolute bottom-1/4 right-10 text-6xl"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -15, 15, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          📚
        </motion.div>
        <motion.div
          className="absolute top-1/2 left-1/4 text-5xl hidden md:block"
          animate={{
            x: [0, 30, 0],
            y: [0, -30, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ✨
        </motion.div>
        <motion.div
          className="absolute top-1/3 right-1/4 text-5xl hidden md:block"
          animate={{
            x: [0, -20, 0],
            y: [0, 20, 0],
            rotate: [0, -180, -360],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🌟
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
