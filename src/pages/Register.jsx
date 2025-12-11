import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash, FaUser, FaEnvelope, FaLock, FaImage } from 'react-icons/fa';

const Register = () => {
  const { registerUser } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoURL: '',
    password: ''
  });
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 6) {
      errors.push('Password must be at least 6 characters');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }
    return errors;
  };

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

    // Validation
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.photoURL.trim()) newErrors.photoURL = 'Photo URL is required';
    
    const passwordErrors = validatePassword(formData.password);
    if (passwordErrors.length > 0) {
      newErrors.password = passwordErrors.join('. ');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await registerUser(formData.email, formData.password, formData.name, formData.photoURL);
      toast.success('Registration successful! Welcome to ScholarStream 🎓');
      navigate('/');
    } catch (error) {
      console.error(error);
      if (error.code === 'auth/email-already-in-use') {
        toast.error('Email already in use. Please try logging in.');
      } else {
        toast.error(error.message || 'Registration failed. Please try again.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6AECE1]/10 via-white to-[#6AECE1]/20 py-6 px-4">
      <div className="max-w-lg w-full mx-auto">
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] rounded-2xl shadow-lg mb-2">
            <span className="text-4xl">🎓</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-pink-600 bg-clip-text text-transparent mb-2">Create Account</h2>
          <p className="text-gray-600">Join ScholarStream and unlock opportunities</p>
        </div>

        <div className="card bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
          <div className="card-body p-6">
            <form onSubmit={handleSubmit} className="space-y-2">
              {/* Name */}
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text font-semibold text-gray-700 flex items-center gap-2 text-sm">
                    <FaUser className="text-purple-500" /> Full Name
                  </span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={`input input-bordered w-full bg-gray-50 border-2 focus:border-purple-500 focus:bg-white transition-all ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.name && <span className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{errors.name}</span>}
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text font-semibold text-gray-700 flex items-center gap-2 text-sm">
                    <FaEnvelope className="text-purple-500" /> Email Address
                  </span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className={`input input-bordered w-full bg-gray-50 border-2 focus:border-purple-500 focus:bg-white transition-all ${errors.email ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.email && <span className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{errors.email}</span>}
              </div>

              {/* Photo URL */}
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text font-semibold text-gray-700 flex items-center gap-2 text-sm">
                    <FaImage className="text-purple-500" /> Profile Photo URL
                  </span>
                </label>
                <input
                  type="url"
                  name="photoURL"
                  value={formData.photoURL}
                  onChange={handleChange}
                  placeholder="Enter your profile photo URL"
                  className={`input input-bordered w-full bg-gray-50 border-2 focus:border-purple-500 focus:bg-white transition-all ${errors.photoURL ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.photoURL && <span className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{errors.photoURL}</span>}
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label pb-2">
                  <span className="label-text font-semibold text-gray-700 flex items-center gap-2 text-sm">
                    <FaLock className="text-purple-500" /> Password
                  </span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a strong password"
                    className={`input input-bordered w-full pr-12 bg-gray-50 border-2 focus:border-purple-500 focus:bg-white transition-all ${errors.password ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-500 transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="text-red-500 text-xs mt-1 flex items-center gap-1"><span>⚠</span>{errors.password}</span>}
           
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn w-full h-11 text-base font-semibold bg-gradient-to-r from-violet-600 to-pink-600 text-white border-0 hover:from-violet-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all mt-4">
                Create Account
              </button>
            </form>

            {/* Login Link */}
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-purple-600 font-semibold hover:text-pink-600 hover:underline transition-colors">
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
