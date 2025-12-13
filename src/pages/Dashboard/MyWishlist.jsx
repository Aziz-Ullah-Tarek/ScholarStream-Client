import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FiHeart, FiTrash2, FiEye } from 'react-icons/fi';
import { FaUniversity, FaDollarSign, FaGraduationCap } from 'react-icons/fa';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const MyWishlist = () => {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get(
        `${API_URL}/api/wishlist/${user.email}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist(response.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (wishlistItemId) => {
    try {
      const token = await user.getIdToken();
      await axios.delete(
        `${API_URL}/api/wishlist/${wishlistItemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setWishlist(wishlist.filter(item => item._id !== wishlistItemId));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading your wishlist..." />;
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
          <FiHeart className="text-red-500" size={32} />
          My Wishlist
        </h1>
        <p className="text-gray-600">
          {wishlist.length} scholarship{wishlist.length !== 1 ? 's' : ''} saved
        </p>
      </motion.div>

      {wishlist.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 bg-white rounded-2xl shadow-lg"
        >
          <FiHeart className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-6">Start adding scholarships you're interested in!</p>
          <Link
            to="/scholarships"
            className="btn bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] text-white border-none shadow-lg"
          >
            Browse Scholarships
          </Link>
        </motion.div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-[#6AECE1]/20 hover:border-[#6AECE1] overflow-hidden"
            >
              {/* Image */}
              <figure className="h-48 overflow-hidden relative">
                <img
                  src={item.universityImage}
                  alt={item.universityName}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                
                {/* Heart Icon */}
                <div className="absolute top-4 right-4">
                  <div className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg">
                    <FiHeart className="text-red-500 fill-red-500" size={20} />
                  </div>
                </div>
              </figure>

              {/* Content */}
              <div className="p-5">
                {/* University */}
                <div className="flex items-center gap-2 mb-2">
                  <FaUniversity className="text-[#26CCC2] text-sm" />
                  <p className="text-sm text-gray-600 font-semibold line-clamp-1">
                    {item.universityName}
                  </p>
                </div>

                {/* Scholarship Name */}
                <h3 className="font-bold text-lg text-gray-800 mb-3 line-clamp-2 min-h-[3.5rem]">
                  {item.scholarshipName}
                </h3>

                {/* Degree */}
                <div className="mb-3">
                  <span className="badge badge-outline border-[#26CCC2] text-[#26CCC2] text-xs">
                    <FaGraduationCap className="mr-1" />
                    {item.degree}
                  </span>
                </div>

                {/* Fee */}
                <div className="flex items-center justify-between mb-4 p-3 bg-gradient-to-r from-[#6AECE1]/10 to-[#FFB76C]/10 rounded-lg">
                  <span className="text-sm text-gray-600 flex items-center gap-1">
                    <FaDollarSign className="text-green-500" />
                    Application Fee
                  </span>
                  <span className="font-bold text-green-600">${item.applicationFees}</span>
                </div>

                {/* Added Date */}
                <p className="text-xs text-gray-500 mb-4">
                  Added on {new Date(item.addedAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link
                    to={`/scholarship/${item.scholarshipId}`}
                    className="btn btn-sm flex-1 bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] hover:from-[#26CCC2] hover:to-[#FFB76C] text-white border-none rounded-xl"
                  >
                    <FiEye size={16} />
                    View
                  </Link>
                  <button
                    onClick={() => handleRemove(item._id)}
                    className="btn btn-sm bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300 rounded-xl"
                    title="Remove from wishlist"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWishlist;
