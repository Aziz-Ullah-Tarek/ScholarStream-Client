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
  FiLogOut,
  FiFileText,
  FiStar
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

  // Moderator sidebar links
  const moderatorLinks = [
    { path: '/dashboard', label: 'My Profile', icon: FiUser, end: true },
    { path: '/dashboard/manage-applications', label: 'Manage Applications', icon: FiBook },
  ];

  // Student sidebar links
  const studentLinks = [
    { path: '/dashboard', label: 'My Profile', icon: FiUser, end: true },
    { path: '/dashboard/my-applications', label: 'My Applications', icon: FiFileText },
    { path: '/dashboard/my-reviews', label: 'My Reviews', icon: FiStar },
  ];

  // Get links based on role
  const sidebarLinks = userRole === 'admin' ? adminLinks : userRole === 'moderator' ? moderatorLinks : studentLinks;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6AECE1]/10 via-[#26CCC2]/10 to-[#6AECE1]/10">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-lg border-b-2 border-[#6AECE1] fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-[#6AECE1]/20 rounded-lg transition-colors"
            >
              {isSidebarOpen ? <FiX size={24} className="text-[#26CCC2]" /> : <FiMenu size={24} className="text-[#26CCC2]" />}
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] bg-clip-text text-transparent">
              📚 ScholarStream Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-semibold text-[#26CCC2]">{user?.displayName || user?.email}</p>
              <p className="text-xs text-[#FFB76C] font-medium uppercase">{userRole}</p>
            </div>
            {user?.photoURL && (
              <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full border-2 border-[#6AECE1]" />
            )}
            <button
              onClick={handleLogout}
              className="btn btn-sm bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] text-white border-none hover:from-[#FFB76C] hover:to-[#FFF57E]"
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
          className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white shadow-2xl border-r-2 border-[#6AECE1] transition-all duration-300 z-40 ${
            isSidebarOpen ? 'w-64' : 'w-0 -translate-x-full'
          }`}
        >
          <nav className="p-4 space-y-2">
            {/* Back to Home Link */}
            <NavLink
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-[#6AECE1]/20 hover:text-[#26CCC2] transition-all group"
            >
              <FiHome size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium">Back to Home</span>
            </NavLink>

            <div className="border-t-2 border-[#6AECE1]/30 my-3"></div>

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
                        ? 'bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] text-white shadow-lg'
                        : 'text-gray-600 hover:bg-[#6AECE1]/20 hover:text-[#26CCC2]'
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
