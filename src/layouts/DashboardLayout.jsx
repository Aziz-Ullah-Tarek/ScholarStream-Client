import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiUser, 
  FiUsers, 
  FiBook, 
  FiPlusCircle, 
  FiBarChart2, 
  FiMenu, 
  FiX,
  FiLogOut 
} from 'react-icons/fi';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, userRole, logOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logOut();
    navigate('/');
  };

  // Admin sidebar links
  const adminLinks = [
    { path: '/dashboard', label: 'My Profile', icon: FiUser, end: true },
    { path: '/dashboard/add-scholarship', label: 'Add Scholarship', icon: FiPlusCircle },
    { path: '/dashboard/manage-scholarships', label: 'Manage Scholarships', icon: FiBook },
    { path: '/dashboard/manage-users', label: 'Manage Users', icon: FiUsers },
    { path: '/dashboard/analytics', label: 'Analytics', icon: FiBarChart2 },
  ];

  // Get links based on role (for now only admin)
  const sidebarLinks = userRole === 'admin' ? adminLinks : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-violet-50">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-lg border-b-2 border-purple-200 fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-purple-100 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <FiX size={24} className="text-purple-600" /> : <FiMenu size={24} className="text-purple-600" />}
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              📚 ScholarStream Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-cyan-500">{user?.displayName || user?.email}</p>
              <p className="text-xs text-purple-600 font-medium uppercase">{userRole}</p>
            </div>
            {user?.photoURL && (
              <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-purple-400" />
            )}
            <button
              onClick={handleLogout}
              className="btn btn-sm bg-gradient-to-r from-purple-600 to-pink-600 text-white border-none hover:from-purple-700 hover:to-pink-700"
            >
              <FiLogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="pt-20 flex">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white shadow-2xl border-r-2 border-purple-200 transition-all duration-300 z-40 ${
            isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full'
          }`}
        >
          <nav className="p-4 space-y-2">
            {/* Back to Home Link */}
            <NavLink
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-purple-50 hover:text-purple-600 transition-all group"
            >
              <FiHome size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </NavLink>

            <div className="border-t-2 border-purple-100 my-3"></div>

            {/* Dynamic Sidebar Links */}
            {sidebarLinks.map((link) => {
              const Icon = link.icon;
              return (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-purple-50 hover:text-purple-600'
                    }`
                  }
                >
                  <Icon size={20} className="group-hover:scale-110 transition-transform" />
                  <span className="font-medium">{link.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Main Content Area */}
        <main
          className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="p-6 max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
