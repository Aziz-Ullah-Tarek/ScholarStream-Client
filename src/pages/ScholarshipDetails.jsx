import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  FiCalendar,
  FiMapPin,
  FiDollarSign,
  FiAward,
  FiGlobe,
  FiBook,
  FiClock,
  FiStar,
  FiUser,
  FiArrowLeft,
  FiHeart
} from 'react-icons/fi';
import { FaUniversity, FaTrophy, FaHeart } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import API_URL from '../config/api';

const ScholarshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scholarship, setScholarship] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedScholarships, setRelatedScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [averageRating, setAverageRating] = useState(0);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistId, setWishlistId] = useState(null);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  useEffect(() => {
    fetchScholarshipDetails();
    fetchReviews();
    fetchRelatedScholarships();
    if (user) {
      checkWishlistStatus();
    }
  }, [id, user]);

  const fetchScholarshipDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/scholarships/${id}`);
      setScholarship(response.data);
    } catch (error) {
      console.error('Error fetching scholarship:', error);
      toast.error('Failed to load scholarship details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/reviews/${id}`);
      setReviews(response.data);
      
      // Calculate average rating
      if (response.data.length > 0) {
        const avg = response.data.reduce((sum, review) => sum + review.ratingPoint, 0) / response.data.length;
        setAverageRating(avg);
      }

      // Check if current user has already reviewed
      if (user?.email) {
        const hasReviewed = response.data.some(review => review.userEmail === user.email);
        setUserHasReviewed(hasReviewed);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const fetchRelatedScholarships = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/scholarships/${id}/related`);
      setRelatedScholarships(response.data);
    } catch (error) {
      console.error('Error fetching related scholarships:', error);
    }
  };

  const checkWishlistStatus = async () => {
    if (!user?.email) return;
    try {
      const token = await user.getIdToken();
      const response = await axios.get(
        `${API_URL}/api/wishlist/check/${user.email}/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsInWishlist(response.data.inWishlist);
      setWishlistId(response.data.wishlistItem?._id);
    } catch (error) {
      console.error('Error checking wishlist:', error);
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.warning('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    setWishlistLoading(true);
    try {
      const token = await user.getIdToken();

      if (isInWishlist) {
        // Remove from wishlist
        await axios.delete(`${API_URL}/api/wishlist/${wishlistId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setIsInWishlist(false);
        setWishlistId(null);
        toast.success('Removed from wishlist');
      } else {
        // Add to wishlist
        const wishlistData = {
          userEmail: user.email,
          scholarshipId: id,
          scholarshipName: scholarship.scholarshipName,
          universityName: scholarship.universityName,
          universityImage: scholarship.universityImage,
          applicationFees: scholarship.applicationFees,
          degree: scholarship.degree
        };
        const response = await axios.post(
          `${API_URL}/api/wishlist`,
          wishlistData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsInWishlist(true);
        setWishlistId(response.data.insertedId);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast.error(error.response?.data?.message || 'Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleWriteReview = () => {
    if (!user) {
      toast.warning('Please login to write a review');
      navigate('/login');
      return;
    }
    if (userHasReviewed) {
      toast.info('You have already reviewed this scholarship. You can edit your review from My Reviews page.');
      return;
    }
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!reviewComment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    if (reviewComment.trim().length < 10) {
      toast.error('Review comment must be at least 10 characters');
      return;
    }

    try {
      setSubmittingReview(true);
      const token = await user.getIdToken();
      await axios.post(
        `${API_URL}/api/reviews`,
        {
          scholarshipId: id,
          scholarshipName: scholarship.scholarshipName,
          universityName: scholarship.universityName,
          userName: user.displayName || 'Anonymous',
          userEmail: user.email,
          userImage: user.photoURL || '',
          ratingPoint: reviewRating,
          reviewComment: reviewComment.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Review submitted successfully!');
      setShowReviewModal(false);
      setReviewRating(5);
      setReviewComment('');
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleApply = () => {
    if (!user) {
      toast.warning('Please login to apply for this scholarship');
      navigate('/login');
      return;
    }
    navigate(`/checkout/${id}`);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <FiStar
        key={index}
        className={`${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
        }`}
        size={18}
      />
    ));
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading scholarship details..." />;
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Scholarship not found</h2>
          <Link to="/scholarships" className="btn bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] text-white border-none">
            Back to Scholarships
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6AECE1]/10 via-white to-[#FFF57E]/10 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate('/scholarships')}
          className="flex items-center gap-2 text-[#26CCC2] hover:text-[#FFB76C] font-semibold mb-6 transition-colors"
        >
          <FiArrowLeft size={20} />
          Back to Scholarships
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-[#6AECE1]/30"
            >
              {/* University Image */}
              <div className="relative h-72 overflow-hidden">
                <img
                  src={scholarship.universityImage}
                  alt={scholarship.universityName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                
                {/* Category Badge */}
                <div className="absolute top-6 right-6">
                  <div className="badge badge-lg bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] text-white border-0 shadow-lg px-6 py-4 font-bold">
                    {scholarship.scholarshipCategory}
                  </div>
                </div>

                {/* Title Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-2 mb-3">
                    <FaUniversity className="text-[#6AECE1]" size={24} />
                    <h3 className="text-xl font-bold">{scholarship.universityName}</h3>
                  </div>
                  <h1 className="text-3xl md:text-4xl font-bold mb-2">
                    {scholarship.scholarshipName}
                  </h1>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <FiMapPin className="text-[#FFB76C]" />
                      <span>{scholarship.universityCity}, {scholarship.universityCountry}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FaTrophy className="text-[#FFF57E]" />
                      <span>World Rank #{scholarship.universityWorldRank}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="p-8">
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  {/* Subject Category */}
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-[#6AECE1]/10 to-white rounded-xl border border-[#6AECE1]/30">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] flex items-center justify-center flex-shrink-0">
                      <FiBook className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Subject Category</p>
                      <p className="text-lg font-bold text-gray-800">{scholarship.subjectCategory}</p>
                    </div>
                  </div>

                  {/* Degree Level */}
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-[#FFF57E]/10 to-white rounded-xl border border-[#FFB76C]/30">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FFB76C] to-[#FFF57E] flex items-center justify-center flex-shrink-0">
                      <FiAward className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Degree Level</p>
                      <p className="text-lg font-bold text-gray-800">{scholarship.degree}</p>
                    </div>
                  </div>

                  {/* Application Fee */}
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-green-50 to-white rounded-xl border border-green-200">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0">
                      <FiDollarSign className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Application Fee</p>
                      <p className="text-lg font-bold text-green-600">${scholarship.applicationFees}</p>
                    </div>
                  </div>

                  {/* Service Charge */}
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0">
                      <FiDollarSign className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Service Charge</p>
                      <p className="text-lg font-bold text-blue-600">${scholarship.serviceCharge}</p>
                    </div>
                  </div>

                  {/* Tuition Fees */}
                  {scholarship.tuitionFees && (
                    <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                        <FiDollarSign className="text-white" size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Tuition Fees</p>
                        <p className="text-lg font-bold text-purple-600">${scholarship.tuitionFees}</p>
                      </div>
                    </div>
                  )}

                  {/* Deadline */}
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-red-50 to-white rounded-xl border border-red-200">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                      <FiCalendar className="text-white" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium">Application Deadline</p>
                      <p className="text-lg font-bold text-red-600">
                        {new Date(scholarship.applicationDeadline).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scholarship Description Section */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FiGlobe className="text-[#26CCC2]" />
                    About This Scholarship
                  </h2>
                  <div className="prose max-w-none">
                    <div className="bg-gradient-to-br from-[#6AECE1]/5 to-[#FFF57E]/5 rounded-xl p-6 border border-[#6AECE1]/20">
                      <p className="text-gray-700 leading-relaxed">
                        This {scholarship.scholarshipCategory.toLowerCase()} scholarship is offered by {scholarship.universityName}, 
                        ranked #{scholarship.universityWorldRank} globally. The program is designed for {scholarship.degree} students 
                        pursuing {scholarship.subjectCategory}.
                      </p>
                      <p className="text-gray-700 leading-relaxed mt-4">
                        Located in {scholarship.universityCity}, {scholarship.universityCountry}, this prestigious institution 
                        offers world-class education and research opportunities. Students will benefit from state-of-the-art 
                        facilities, renowned faculty, and a diverse international community.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Coverage Details */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FiAward className="text-[#FFB76C]" />
                    Scholarship Coverage
                  </h2>
                  <div className="bg-gradient-to-br from-[#26CCC2]/5 to-[#FFB76C]/5 rounded-xl p-6 border border-[#26CCC2]/20">
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                        <span className="text-gray-700">
                          <strong className="text-gray-900">Coverage Type:</strong> {scholarship.scholarshipCategory}
                        </span>
                      </li>
                      {scholarship.tuitionFees && (
                        <li className="flex items-start gap-3">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-white text-xs font-bold">✓</span>
                          </div>
                          <span className="text-gray-700">
                            <strong className="text-gray-900">Tuition Coverage:</strong> Up to ${scholarship.tuitionFees} per year
                          </span>
                        </li>
                      )}
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                        <span className="text-gray-700">
                          <strong className="text-gray-900">Subject Focus:</strong> {scholarship.subjectCategory}
                        </span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-white text-xs font-bold">✓</span>
                        </div>
                        <span className="text-gray-700">
                          <strong className="text-gray-900">Academic Support:</strong> Access to world-class research facilities and mentorship
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Reviews Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#6AECE1]/30"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <FiStar className="text-yellow-400 fill-yellow-400" />
                  Student Reviews
                </h2>
                <div className="flex items-center gap-3">
                  {reviews.length > 0 && (
                    <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50 to-orange-50 px-4 py-2 rounded-xl border border-yellow-200">
                      <div className="flex items-center gap-1">
                        {renderStars(Math.round(averageRating))}
                      </div>
                      <span className="font-bold text-gray-800">
                        {averageRating.toFixed(1)} ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  )}
                  {user && (
                    <button
                      onClick={handleWriteReview}
                      disabled={userHasReviewed}
                      className={`px-4 py-2 rounded-xl font-medium transition-all ${
                        userHasReviewed
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] text-white hover:shadow-lg'
                      }`}
                    >
                      {userHasReviewed ? 'Already Reviewed' : 'Write a Review'}
                    </button>
                  )}
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                  <FiStar className="mx-auto text-gray-300 mb-4" size={48} />
                  <p className="text-gray-500 text-lg">No reviews yet</p>
                  <p className="text-gray-400 text-sm mt-2">Be the first to review this scholarship!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:border-[#6AECE1] transition-all"
                    >
                      <div className="flex items-start gap-4">
                        {/* Reviewer Avatar */}
                        <div className="flex-shrink-0">
                          {review.userPhoto ? (
                            <img
                              src={review.userPhoto}
                              alt={review.userName}
                              className="w-12 h-12 rounded-full object-cover border-2 border-[#6AECE1]"
                              onError={(e) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(review.userName)}&background=26CCC2&color=fff`;
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] flex items-center justify-center">
                              <FiUser className="text-white" size={24} />
                            </div>
                          )}
                        </div>

                        {/* Review Content */}
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-bold text-gray-800">{review.userName}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-0.5">
                                  {renderStars(review.ratingPoint)}
                                </div>
                                <span className="text-sm text-gray-500">•</span>
                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                  <FiClock size={14} />
                                  {new Date(review.reviewDate).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">{review.reviewComment}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 space-y-6"
            >
              {/* Application Card */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#6AECE1]/30">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Apply Now</h3>
                
                {/* Total Cost */}
                <div className="bg-gradient-to-br from-[#26CCC2]/10 to-[#FFB76C]/10 rounded-2xl p-6 mb-6 border-2 border-[#6AECE1]/30">
                  <p className="text-sm text-gray-600 mb-2">Total Application Cost</p>
                  <p className="text-4xl font-bold bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] bg-clip-text text-transparent">
                    ${(scholarship.applicationFees + scholarship.serviceCharge).toFixed(2)}
                  </p>
                  <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Application Fee</span>
                      <span className="font-semibold">${scholarship.applicationFees}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Service Charge</span>
                      <span className="font-semibold">${scholarship.serviceCharge}</span>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleApply}
                  className="btn w-full bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] hover:from-[#26CCC2] hover:to-[#FFB76C] text-white border-none text-lg py-4 h-auto rounded-2xl shadow-lg hover:shadow-xl transition-all mb-3"
                >
                  <FiAward size={24} />
                  Apply for Scholarship
                </motion.button>

                {/* Wishlist Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={toggleWishlist}
                  disabled={wishlistLoading}
                  className={`btn w-full border-2 text-lg py-4 h-auto rounded-2xl shadow-md hover:shadow-lg transition-all ${
                    isInWishlist
                      ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100'
                      : 'bg-white border-[#26CCC2] text-[#26CCC2] hover:bg-[#6AECE1]/10'
                  }`}
                >
                  {wishlistLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : isInWishlist ? (
                    <>
                      <FaHeart size={20} />
                      Remove from Wishlist
                    </>
                  ) : (
                    <>
                      <FiHeart size={20} />
                      Add to Wishlist
                    </>
                  )}
                </motion.button>

                {/* Deadline Warning */}
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <FiClock className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                    <div>
                      <p className="text-sm font-semibold text-red-800">Application Deadline</p>
                      <p className="text-sm text-red-600 mt-1">
                        {new Date(scholarship.applicationDeadline).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#6AECE1]/30">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Information</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <FaTrophy className="text-[#FFB76C] flex-shrink-0 mt-1" size={18} />
                    <div>
                      <p className="font-semibold text-gray-800">World Ranking</p>
                      <p className="text-gray-600">#{scholarship.universityWorldRank}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiMapPin className="text-[#26CCC2] flex-shrink-0 mt-1" size={18} />
                    <div>
                      <p className="font-semibold text-gray-800">Location</p>
                      <p className="text-gray-600">{scholarship.universityCity}, {scholarship.universityCountry}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiBook className="text-purple-500 flex-shrink-0 mt-1" size={18} />
                    <div>
                      <p className="font-semibold text-gray-800">Subject</p>
                      <p className="text-gray-600">{scholarship.subjectCategory}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FiAward className="text-green-500 flex-shrink-0 mt-1" size={18} />
                    <div>
                      <p className="font-semibold text-gray-800">Degree Level</p>
                      <p className="text-gray-600">{scholarship.degree}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* You May Also Like Section */}
        {relatedScholarships.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
              <FiAward className="text-[#26CCC2]" />
              You May Also Like
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedScholarships.map((relScholarship, index) => (
                <motion.div
                  key={relScholarship._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all border-2 border-[#6AECE1]/20 hover:border-[#6AECE1] overflow-hidden"
                >
                  <figure className="h-40 overflow-hidden relative">
                    <img
                      src={relScholarship.universityImage}
                      alt={relScholarship.universityName}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </figure>
                  
                  <div className="p-5">
                    <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 min-h-[3.5rem]">
                      {relScholarship.scholarshipName}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                      <FaUniversity className="text-[#26CCC2]" size={14} />
                      {relScholarship.universityName}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-gray-600">Application Fee</span>
                      <span className="font-bold text-[#26CCC2]">${relScholarship.applicationFees}</span>
                    </div>
                    <Link
                      to={`/scholarship/${relScholarship._id}`}
                      className="btn btn-sm w-full bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] hover:from-[#26CCC2] hover:to-[#FFB76C] text-white border-none rounded-xl"
                    >
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <FiStar className="text-yellow-400" />
                Write a Review
              </h2>
              <p className="text-gray-600 mt-1">{scholarship?.scholarshipName}</p>
            </div>

            <form onSubmit={handleSubmitReview} className="p-6">
              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  Rating *
                </label>
                <div className="flex gap-2 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none transition-all"
                    >
                      <FiStar
                        className={`text-3xl ${
                          star <= reviewRating
                            ? 'fill-amber-400 text-amber-400 scale-110'
                            : 'text-gray-300 hover:text-amber-200'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="ml-3 text-lg font-bold text-gray-700">{reviewRating}/5</span>
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Review Comment *
                </label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows="6"
                  required
                  minLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#26CCC2] focus:border-transparent resize-none"
                  placeholder="Share your thoughts about this scholarship, university, or application process..."
                />
                <p className="text-sm text-gray-500 mt-1">
                  Minimum 10 characters ({reviewComment.length}/10)
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewRating(5);
                    setReviewComment('');
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all"
                  disabled={submittingReview}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview || reviewComment.trim().length < 10}
                  className="px-6 py-3 bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ScholarshipDetails;
