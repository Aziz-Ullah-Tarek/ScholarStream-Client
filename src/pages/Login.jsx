import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaGoogle } from 'react-icons/fa';

const Login = () => {
  const { loginUser, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await loginUser(formData.email, formData.password);
      toast.success('Login successful! Welcome back 🎓');
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        toast.error('Invalid email or password');
      } else if (error.code === 'auth/invalid-credential') {
        toast.error('Invalid credentials. Please check your email and password.');
      } else {
        toast.error(error.message || 'Login failed. Please try again.');
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      toast.success('Login successful! Welcome 🎓');
      navigate(from, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Google login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6AECE1]/10 via-white to-[#6AECE1]/20 py-6 px-4">
      <div className="max-w-lg w-full mx-auto">
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] rounded-2xl shadow-lg mb-2">
            <span className="text-4xl">🎓</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] bg-clip-text text-transparent mb-2">Welcome Back</h2>
          <p className="text-gray-600">Sign in to continue your journey</p>
        </div>

        <div className="card bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
          <div className="card-body p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-semibold text-gray-700 flex items-center gap-2 text-sm">
                    <FaEnvelope className="text-[#26CCC2]" /> Email Address
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className={`input input-sm input-bordered w-full bg-gray-50 border-2 focus:border-[#26CCC2] focus:bg-white transition-all ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.email && <span className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{errors.email}</span>}
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label pb-1">
                  <span className="label-text font-semibold text-gray-700 flex items-center gap-2 text-sm">
                    <FaLock className="text-[#26CCC2]" /> Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`input input-sm input-bordered w-full pr-10 bg-gray-50 border-2 focus:border-[#26CCC2] focus:bg-white transition-all ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#26CCC2] transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.password && <span className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{errors.password}</span>}
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn w-full h-11 text-base font-semibold bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] text-white border-0 hover:from-[#FFB76C] hover:to-[#FFF57E] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all mt-4">
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div className="divider text-gray-400 text-xs my-2">OR CONTINUE WITH</div>

            {/* Google Login */}
            <button
              onClick={handleGoogleLogin}
              className="btn btn-outline w-full gap-2 h-11 border-2 border-gray-300 hover:border-[#26CCC2] hover:bg-[#6AECE1]/10 text-gray-700 hover:text-[#26CCC2] font-semibold transition-all"
            >
              <FaGoogle className="text-lg text-[#FFB76C]" />
              Sign in with Google
            </button>

            {/* Register Link */}
            <div className="text-center mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#26CCC2] font-semibold hover:text-[#FFB76C] hover:underline transition-colors">
                  Create Account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
