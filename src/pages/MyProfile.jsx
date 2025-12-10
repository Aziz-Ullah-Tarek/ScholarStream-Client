import { useAuth } from '../context/AuthContext';
import { FiMail, FiUser, FiShield, FiCalendar } from 'react-icons/fi';

const MyProfile = () => {
  const { user, userRole } = useAuth();

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-gradient-to-r from-red-500 to-pink-500';
      case 'moderator':
        return 'bg-gradient-to-r from-blue-500 to-cyan-500';
      default:
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          My Profile
        </h1>
        <p className="text-gray-600 mt-2">View and manage your profile information</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-purple-200">
        {/* Cover Image with Gradient */}
        <div className="h-32 bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600"></div>

        {/* Profile Content */}
        <div className="relative px-8 pb-8">
          {/* Profile Picture */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16">
            <div className="relative">
              <img
                src={user?.photoURL || 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-2xl object-cover"
              />
              <div className={`absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white ${
                user ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <h2 className="text-3xl font-bold text-gray-800">{user?.displayName || 'Anonymous User'}</h2>
              <p className="text-gray-500 text-lg">{user?.email}</p>
              <div className="mt-3">
                <span className={`${getRoleBadgeColor(userRole)} text-white px-6 py-2 rounded-full text-sm font-bold uppercase shadow-lg inline-block`}>
                  {userRole}
                </span>
              </div>
            </div>
          </div>

          {/* Profile Details Grid */}
          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {/* Email Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-600 rounded-lg">
                  <FiMail size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Email Address</p>
                  <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Display Name Card */}
            <div className="bg-gradient-to-br from-pink-50 to-violet-50 rounded-xl p-6 border-2 border-pink-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-pink-600 rounded-lg">
                  <FiUser size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Display Name</p>
                  <p className="text-lg font-semibold text-gray-800">{user?.displayName || 'Not Set'}</p>
                </div>
              </div>
            </div>

            {/* Role Card */}
            <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-6 border-2 border-violet-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-violet-600 rounded-lg">
                  <FiShield size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">User Role</p>
                  <p className="text-lg font-semibold text-gray-800 capitalize">{userRole}</p>
                </div>
              </div>
            </div>

            {/* Account Status Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-600 rounded-lg">
                  <FiCalendar size={24} className="text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Account Status</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {user?.emailVerified ? '✅ Verified' : '⏳ Pending Verification'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Account Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-purple-200">
                <span className="text-gray-600 font-medium">User ID</span>
                <span className="text-gray-800 font-mono text-sm">{user?.uid?.slice(0, 20)}...</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-purple-200">
                <span className="text-gray-600 font-medium">Email Verified</span>
                <span className={`font-semibold ${user?.emailVerified ? 'text-green-600' : 'text-orange-600'}`}>
                  {user?.emailVerified ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-purple-200">
                <span className="text-gray-600 font-medium">Provider</span>
                <span className="text-gray-800 font-semibold capitalize">
                  {user?.providerData?.[0]?.providerId?.replace('.com', '') || 'Email'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 font-medium">Last Sign In</span>
                <span className="text-gray-800 font-semibold">
                  {user?.metadata?.lastSignInTime ? new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
