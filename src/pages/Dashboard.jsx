import { useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, FiUser, FiPlus, FiList, FiUsers, FiBarChart2, 
  FiMenu, FiX, FiLogOut, FiCheckCircle 
} from 'react-icons/fi';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, userRole, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check if user is authenticated
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  // Admin sidebar links
  const adminLinks = [
    { path: '/dashboard/my-profile', icon: FiUser, label: 'My Profile' },
    { path: '/dashboard/add-scholarship', icon: FiPlus, label: 'Add Scholarship' },
    { path: '/dashboard/manage-scholarships', icon: FiList, label: 'Manage Scholarships' },
    { path: '/dashboard/manage-users', icon: FiUsers, label: 'Manage Users' },
    { path: '/dashboard/analytics', icon: FiBarChart2, label: 'Analytics' },
  ];

  // Moderator sidebar links
  const moderatorLinks = [
    { path: '/dashboard/my-profile', icon: FiUser, label: 'My Profile' },
    { path: '/dashboard/manage-applications', icon: FiCheckCircle, label: 'Manage Applications' },
  ];

  // Student sidebar links
  const studentLinks = [
    { path: '/dashboard/my-profile', icon: FiUser, label: 'My Profile' },
    { path: '/dashboard/my-applications', icon: FiList, label: 'My Applications' },
  ];

  // Get links based on role
  const getSidebarLinks = () => {
    if (userRole === 'admin') return adminLinks;
    if (userRole === 'moderator') return moderatorLinks;
    return studentLinks;
  };

  const sidebarLinks = getSidebarLinks();

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'from-red-500 to-pink-500';
      case 'moderator':
        return 'from-blue-500 to-cyan-500';
      default:
        return 'from-green-500 to-emerald-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-lg border-b-2 border-purple-200 sticky top-0 z-50">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left: Menu + Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-purple-100 text-purple-600 transition-colors"
              >
                {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
              </button>
              
              <Link to="/" className="flex items-center gap-2">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  ScholarStream
                </div>
              </Link>
            </div>

            {/* Right: User Info */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-3">
                <img
                  src={user?.photoURL || 'https://via.placeholder.com/40'}
                  alt="Profile"
                  className="w-10 h-10 rounded-full border-2 border-purple-300 object-cover"
                />
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{user?.displayName || 'User'}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${getRoleBadgeColor(userRole)} text-white font-bold uppercase`}>
                    {userRole}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-colors"
                title="Logout"
              >
                <FiLogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 
          bg-white shadow-2xl border-r-2 border-purple-200
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          mt-16 lg:mt-0
        `}>
          <div className="h-full flex flex-col">
            {/* Sidebar Header - Only visible on larger screens */}
            <div className="hidden lg:block p-6 border-b-2 border-purple-100">
              <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Dashboard Menu
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {userRole === 'admin' ? 'Admin Panel' : userRole === 'moderator' ? 'Moderator Panel' : 'Student Panel'}
              </p>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              {/* Home Link */}
              <Link
                to="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 transition-all group"
              >
                <FiHome className="text-xl group-hover:text-purple-600" />
                <span className="font-medium group-hover:text-purple-600">Back to Home</span>
              </Link>

              <div className="border-t-2 border-purple-100 my-4"></div>

              {/* Role-based Links */}
              {sidebarLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                      ${isActive 
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105' 
                        : 'text-gray-700 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100'
                      }
                    `}
                  >
                    <link.icon className={`text-xl ${isActive ? 'text-white' : 'group-hover:text-purple-600'}`} />
                    <span className={`font-medium ${isActive ? 'text-white' : 'group-hover:text-purple-600'}`}>
                      {link.label}
                    </span>
                  </Link>
                );
              })}
            </nav>

            {/* Sidebar Footer */}
            <div className="p-4 border-t-2 border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="flex items-center gap-3 mb-3">
                <img
                  src={user?.photoURL || 'https://via.placeholder.com/40'}
                  alt="Profile"
                  className="w-12 h-12 rounded-full border-2 border-purple-300 object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user?.displayName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
