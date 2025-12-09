import { Link, NavLink } from 'react-router-dom';
import { useState } from 'react';

const Navbar = () => {
  const user = null; // Replace with actual user authentication logic
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-base-100 shadow-lg sticky top-0 z-50 backdrop-blur-md bg-base-100/95">
      <div className="max-w-7xl mx-auto navbar px-4 py-3">
        {/* Logo */}
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary hover:scale-105 transition-transform">
            <div className="bg-gradient-to-br from-primary to-secondary p-2 rounded-xl shadow-lg">
              <span className="text-3xl">🎓</span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl leading-none">ScholarStream</span>
              <span className="text-xs text-base-content/60 font-normal">Your Path to Success</span>
            </div>
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="flex-none hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  `font-medium transition-all ${isActive ? 'active' : 'hover:text-primary'}`
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/scholarships" 
                className={({ isActive }) => 
                  `font-medium transition-all ${isActive ? 'active' : 'hover:text-primary'}`
                }
              >
                All Scholarships
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Auth Buttons / User Profile */}
        <div className="flex-none gap-3 ml-4">
          {user ? (
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-primary transition-all">
                <div className="w-10 rounded-full ring-2 ring-primary/20">
                  <img src={user?.photo || 'https://via.placeholder.com/40'} alt="User" />
                </div>
              </label>
              <ul tabIndex={0} className="mt-3 z-[1] p-3 shadow-xl menu menu-sm dropdown-content bg-base-100 rounded-box w-56 border border-base-300">
                <li className="menu-title">
                  <span className="text-primary font-bold">My Account</span>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:bg-primary/10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Dashboard
                  </Link>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <a className="hover:bg-error/10 text-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm lg:btn-md font-medium hover:text-primary">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm lg:btn-md font-medium shadow-lg hover:shadow-xl transition-all">
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden ml-2">
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="btn btn-ghost btn-circle hover:bg-primary/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden bg-base-100 border-t border-base-300 shadow-lg">
          <ul className="menu menu-vertical px-4 py-2">
            <li>
              <NavLink 
                to="/" 
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/scholarships" 
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => isActive ? 'active' : ''}
              >
                All Scholarships
              </NavLink>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
