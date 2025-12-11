import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiStar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingSpinner from '../../components/LoadingSpinner';
import ConfirmDialog from '../../components/ConfirmDialog';

const MyReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ ratingPoint: 5, reviewComment: '' });

  useEffect(() => {
    if (user?.email) {
      fetchReviews();
    }
  }, [user]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/user/${user.email}`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setSelectedReview(review);
    setEditData({
      ratingPoint: review.ratingPoint,
      reviewComment: review.reviewComment
    });
    setShowEditModal(true);
  };

  const handleUpdateReview = async () => {
    const trimmedComment = editData.reviewComment.trim();
    
    if (!trimmedComment) {
      toast.error('Please enter a review comment');
      return;
    }

    if (trimmedComment.length < 10) {
      toast.error('Review comment must be at least 10 characters long');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${selectedReview._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          ratingPoint: editData.ratingPoint,
          reviewComment: trimmedComment
        })
      });

      if (response.ok) {
        toast.success('Review updated successfully!');
        setShowEditModal(false);
        setEditData({ ratingPoint: 5, reviewComment: '' });
        fetchReviews();
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Failed to update review. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });

      if (response.ok) {
        setReviews(reviews.filter(review => review._id !== id));
        toast.success('Review deleted successfully!');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      toast.error('Failed to delete review. Please try again.');
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FiStar
            key={star}
            className={star <= rating ? 'text-[#FFB76C] fill-[#FFB76C]' : 'text-gray-300'}
            size={18}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-[#26CCC2]"></span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Reviews</h1>
        <p className="text-gray-600">Manage all your scholarship reviews</p>
      </motion.div>
      {loading ? (
        <LoadingSpinner message="Loading your reviews..." />
      ) : (      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] text-white">
              <tr>
                <th>Scholarship Name</th>
                <th>University Name</th>
                <th>Review Comment</th>
                <th>Review Date</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No reviews yet. Complete an application to add a review!
                  </td>
                </tr>
              ) : (
                reviews.map((review, index) => (
                  <motion.tr
                    key={review._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-[#6AECE1]/10"
                  >
                    <td className="font-semibold text-gray-800">{review.scholarshipName}</td>
                    <td className="text-gray-600">{review.universityName}</td>
                    <td className="max-w-md">
                      <p className="text-sm text-gray-700 line-clamp-2">{review.reviewComment}</p>
                    </td>
                    <td className="text-sm text-gray-600">
                      {new Date(review.reviewDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td>{renderStars(review.ratingPoint)}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(review)}
                          className="btn btn-sm bg-[#FFB76C] hover:bg-[#FFB76C]/80 text-white border-0"
                          title="Edit Review"
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          onClick={() => handleDelete(review._id)}
                          className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-0"
                          title="Delete Review"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
      )}

      {/* Edit Review Modal */}
      <AnimatePresence>
        {showEditModal && selectedReview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal modal-open"
            onClick={() => setShowEditModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="modal-box bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold text-2xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#26CCC2] to-[#6AECE1]">
                Edit Review
              </h3>

              <div className="mb-6 p-4 bg-[#6AECE1]/10 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Scholarship</p>
                <p className="font-semibold text-gray-800 text-lg">{selectedReview.scholarshipName}</p>
                <p className="text-sm text-gray-600 mt-1">{selectedReview.universityName}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700">
                      Rating <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <div className="rating rating-lg gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <input
                        key={star}
                        type="radio"
                        name="edit-rating"
                        className="mask mask-star-2 bg-[#FFB76C] cursor-pointer hover:scale-110 transition-transform"
                        checked={editData.ratingPoint === star}
                        onChange={() => setEditData({ ...editData, ratingPoint: star })}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Selected: {editData.ratingPoint} {editData.ratingPoint === 1 ? 'star' : 'stars'}</p>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700">
                      Review Comment <span className="text-red-500">*</span>
                    </span>
                    <span className="label-text-alt text-gray-500">
                      {editData.reviewComment.length}/500
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-32 focus:outline-none focus:ring-2 focus:ring-[#26CCC2] border-2 border-gray-200 hover:border-[#6AECE1] transition-colors resize-none"
                    placeholder="Update your review comment... (minimum 10 characters)"
                    value={editData.reviewComment}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setEditData({ ...editData, reviewComment: e.target.value });
                      }
                    }}
                    maxLength={500}
                    required
                  ></textarea>
                  {editData.reviewComment.trim().length > 0 && editData.reviewComment.trim().length < 10 && (
                    <p className="text-xs text-red-500 mt-1">Comment must be at least 10 characters</p>
                  )}
                </div>
              </div>

              <div className="modal-action">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditData({ ratingPoint: 5, reviewComment: '' });
                  }}
                  className="btn btn-outline border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateReview}
                  className="btn bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] text-white border-0 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!editData.reviewComment.trim() || editData.reviewComment.trim().length < 10}
                >
                  Update Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyReviews;
