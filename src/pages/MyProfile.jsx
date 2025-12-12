import { useAuth } from '../context/AuthContext';
import { FiMail, FiUser, FiShield, FiCalendar, FiCheckCircle, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const MyProfile = () => {
  const { user, userRole } = useAuth();

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-[#FFB76C] to-[#FFF57E]';
      case 'moderator':
        return 'bg-gradient-to-r from-[#26CCC2] to-[#6AECE1]';
      default:
        return 'bg-gradient-to-r from-[#6AECE1] to-[#26CCC2]';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-lg p-6 border-2 border-[#6AECE1]"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-gray-600 mt-2">View and manage your profile information</p>
      </motion.div>

      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-[#6AECE1]"
      >
        {/* Cover Image with Gradient */}
        <div className="h-40 bg-gradient-to-r from-[#6AECE1] via-[#26CCC2] to-[#6AECE1] relative overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-30"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              backgroundSize: '200% 100%',
            }}
          />
        </div>

        {/* Profile Content */}
        <div className="relative px-8 pb-8">
          {/* Profile Picture */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-20">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-36 h-36 rounded-full border-4 border-white shadow-2xl bg-gradient-to-br from-[#6AECE1] to-[#26CCC2] p-1">
                <img
                  src={user?.photoURL || 'https://via.placeholder.com/150'}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <motion.div
                className={`absolute bottom-2 right-2 w-7 h-7 rounded-full border-4 border-white ${
                  user ? 'bg-[#26CCC2]' : 'bg-gray-400'
                } shadow-lg`}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <FiCheckCircle className="text-white w-full h-full p-0.5" />
              </motion.div>
            </motion.div>

            <div className="flex-1 text-center md:text-left">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold bg-gradient-to-r from-[#8c9a99] to-[#828e8d] bg-clip-text text-transparent"
              >
                {user?.displayName || 'Anonymous User'}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-700 text-xl mt-2 flex items-center gap-2 justify-center md:justify-start"
              >
                <FiMail className="text-[#6a918e]" />
                {user?.email}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4"
              >
                <span className={`${getRoleBadgeColor(userRole)} text-white px-8 py-3 rounded-full text-sm font-bold uppercase shadow-lg inline-block`}>
                  {userRole}
                </span>
              </motion.div>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-12">
            {/* Email Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(106, 236, 225, 0.2)" }}
              className="bg-gradient-to-br from-[#6AECE1]/10 to-[#26CCC2]/10 rounded-2xl p-6 border-2 border-[#6AECE1] hover:border-[#26CCC2] transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-[#6AECE1] to-[#26CCC2] rounded-xl shadow-lg">
                  <FiMail size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-semibold mb-1">Email Address</p>
                  <p className="text-lg font-bold text-gray-800 break-all">{user?.email}</p>
                </div>
              </div>
            </motion.div>

            {/* Display Name Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(255, 245, 126, 0.2)" }}
              className="bg-gradient-to-br from-[#FFF57E]/10 to-[#FFB76C]/10 rounded-2xl p-6 border-2 border-[#FFF57E] hover:border-[#FFB76C] transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-[#FFF57E] to-[#FFB76C] rounded-xl shadow-lg">
                  <FiUser size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-semibold mb-1">Display Name</p>
                  <p className="text-lg font-bold text-gray-800">{user?.displayName || 'Not Set'}</p>
                </div>
              </div>
            </motion.div>

            {/* Role Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(38, 204, 194, 0.2)" }}
              className="bg-gradient-to-br from-[#26CCC2]/10 to-[#6AECE1]/10 rounded-2xl p-6 border-2 border-[#26CCC2] hover:border-[#6AECE1] transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] rounded-xl shadow-lg">
                  <FiShield size={28} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-semibold mb-1">User Role</p>
                  <p className="text-lg font-bold text-gray-800 capitalize">{userRole}</p>
                </div>
              </div>
            </motion.div>

            {/* Account Status Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9 }}
              whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(255, 183, 108, 0.2)" }}
              className="bg-gradient-to-br from-[#FFB76C]/10 to-[#FFF57E]/10 rounded-2xl p-6 border-2 border-[#FFB76C] hover:border-[#FFF57E] transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-[#FFB76C] to-[#FFF57E] rounded-xl shadow-lg">
                  {user?.emailVerified ? (
                    <FiCheckCircle size={28} className="text-white" />
                  ) : (
                    <FiClock size={28} className="text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-500 font-semibold mb-1">Account Status</p>
                  <p className="text-lg font-bold text-gray-800">
                    {user?.emailVerified ? '✅ Verified' : '⏳ Pending Verification'}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Additional Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-8 bg-gradient-to-r from-[#6AECE1]/10 via-[#26CCC2]/10 to-[#6AECE1]/10 rounded-2xl p-6 border-2 border-[#6AECE1]"
          >
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] bg-clip-text text-transparent mb-6 flex items-center gap-2">
              <FiCalendar className="text-[#26CCC2]" />
              Account Information
            </h3>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b-2 border-[#6AECE1]/30">
                <span className="text-gray-600 font-semibold mb-2 sm:mb-0">User ID</span>
                <span className="text-gray-800 font-mono text-sm bg-[#6AECE1]/20 px-4 py-2 rounded-lg">{user?.uid?.slice(0, 20)}...</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b-2 border-[#6AECE1]/30">
                <span className="text-gray-600 font-semibold mb-2 sm:mb-0">Email Verified</span>
                <span className={`font-bold px-4 py-2 rounded-lg ${user?.emailVerified ? 'bg-[#26CCC2]/20 text-[#26CCC2]' : 'bg-[#FFB76C]/20 text-[#FFB76C]'}`}>
                  {user?.emailVerified ? 'Yes ✓' : 'No ✗'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3 border-b-2 border-[#6AECE1]/30">
                <span className="text-gray-600 font-semibold mb-2 sm:mb-0">Provider</span>
                <span className="text-gray-800 font-bold capitalize bg-[#FFF57E]/20 px-4 py-2 rounded-lg">
                  {user?.providerData?.[0]?.providerId?.replace('.com', '') || 'Email'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-3">
                <span className="text-gray-600 font-semibold mb-2 sm:mb-0">Last Sign In</span>
                <span className="text-gray-800 font-bold bg-[#FFB76C]/20 px-4 py-2 rounded-lg">
                  {user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default MyProfile;
