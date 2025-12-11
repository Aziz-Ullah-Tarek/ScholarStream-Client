import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiEye, FiEdit2, FiTrash2, FiDollarSign, FiStar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const MyApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({ ratingPoint: 5, reviewComment: '' });

  useEffect(() => {
    if (user?.email) {
      fetchApplications();
    }
  }, [user]);

  const fetchApplications = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/applications/user/${user.email}`);
      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      const response = await fetch(`http://localhost:5000/api/applications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await user.getIdToken()}`
        }
      });

      if (response.ok) {
        setApplications(applications.filter(app => app._id !== id));
        alert('Application deleted successfully');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete application');
      }
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application. Please try again.');
    }
  };

  const handleSubmitReview = async () => {
    const trimmedComment = reviewData.reviewComment.trim();
    
    if (!trimmedComment) {
      alert('Please enter a review comment');
      return;
    }

    if (trimmedComment.length < 10) {
      alert('Review comment must be at least 10 characters long');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          scholarshipId: selectedApplication.scholarshipId,
          scholarshipName: selectedApplication.scholarshipName,
          universityName: selectedApplication.universityName,
          userEmail: user.email,
          userName: user.displayName || 'Anonymous',
          userPhoto: user.photoURL || '',
          ratingPoint: reviewData.ratingPoint,
          reviewComment: trimmedComment
        })
      });

      if (response.ok) {
        alert('Review submitted successfully!');
        setShowReviewModal(false);
        setReviewData({ ratingPoint: 5, reviewComment: '' });
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again.');
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      pending: 'bg-[#FFF57E] text-gray-800',
      processing: 'bg-[#FFB76C] text-white',
      completed: 'bg-[#26CCC2] text-white',
      rejected: 'bg-red-500 text-white'
    };
    return statusColors[status] || 'bg-gray-500 text-white';
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Applications</h1>
        <p className="text-gray-600">Track and manage all your scholarship applications</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="table">
            <thead className="bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] text-white">
              <tr>
                <th>University Name</th>
                <th>University Address</th>
                <th>Subject Category</th>
                <th>Application Fees</th>
                <th>Status</th>
                <th>Feedback</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No applications found. Start applying to scholarships!
                  </td>
                </tr>
              ) : (
                applications.map((app, index) => (
                  <motion.tr
                    key={app._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-[#6AECE1]/10"
                  >
                    <td className="font-semibold">{app.universityName}</td>
                    <td className="text-sm text-gray-600">{app.universityAddress}</td>
                    <td>
                      <span className="badge badge-outline border-[#26CCC2] text-[#26CCC2]">
                        {app.subjectCategory}
                      </span>
                    </td>
                    <td className="font-bold text-[#26CCC2]">${app.applicationFees}</td>
                    <td>
                      <span className={`badge ${getStatusBadge(app.applicationStatus)}`}>
                        {app.applicationStatus}
                      </span>
                    </td>
                    <td className="text-sm text-gray-600 max-w-xs truncate">
                      {app.feedback || 'No feedback yet'}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedApplication(app);
                            setShowDetailsModal(true);
                          }}
                          className="btn btn-sm bg-[#6AECE1] hover:bg-[#26CCC2] text-white border-0"
                          title="View Details"
                        >
                          <FiEye />
                        </button>

                        {app.applicationStatus === 'pending' && (
                          <>
                            <button
                              className="btn btn-sm bg-[#FFB76C] hover:bg-[#FFB76C]/80 text-white border-0"
                              title="Edit"
                            >
                              <FiEdit2 />
                            </button>

                            {app.paymentStatus === 'unpaid' && (
                              <button
                                className="btn btn-sm bg-[#FFF57E] hover:bg-[#FFF57E]/80 text-gray-800 border-0"
                                title="Pay"
                              >
                                <FiDollarSign />
                              </button>
                            )}

                            <button
                              onClick={() => handleDelete(app._id)}
                              className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-0"
                              title="Delete"
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}

                        {app.applicationStatus === 'completed' && (
                          <button
                            onClick={() => {
                              setSelectedApplication(app);
                              setShowReviewModal(true);
                            }}
                            className="btn btn-sm bg-[#26CCC2] hover:bg-[#26CCC2]/80 text-white border-0"
                            title="Add Review"
                          >
                            <FiStar /> Review
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal modal-open"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="modal-box max-w-3xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold text-2xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#26CCC2] to-[#6AECE1]">
                Application Details
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#6AECE1]/10 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Scholarship Name</p>
                    <p className="font-semibold text-gray-800">{selectedApplication.scholarshipName}</p>
                  </div>
                  <div className="bg-[#6AECE1]/10 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">University Name</p>
                    <p className="font-semibold text-gray-800">{selectedApplication.universityName}</p>
                  </div>
                  <div className="bg-[#6AECE1]/10 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Subject Category</p>
                    <p className="font-semibold text-gray-800">{selectedApplication.subjectCategory}</p>
                  </div>
                  <div className="bg-[#6AECE1]/10 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Application Fees</p>
                    <p className="font-semibold text-[#26CCC2]">${selectedApplication.applicationFees}</p>
                  </div>
                  <div className="bg-[#6AECE1]/10 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Application Status</p>
                    <span className={`badge ${getStatusBadge(selectedApplication.applicationStatus)}`}>
                      {selectedApplication.applicationStatus}
                    </span>
                  </div>
                  <div className="bg-[#6AECE1]/10 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Payment Status</p>
                    <span className={`badge ${selectedApplication.paymentStatus === 'paid' ? 'bg-[#26CCC2]' : 'bg-[#FFF57E] text-gray-800'} text-white`}>
                      {selectedApplication.paymentStatus}
                    </span>
                  </div>
                </div>

                <div className="bg-[#6AECE1]/10 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">University Address</p>
                  <p className="font-semibold text-gray-800">{selectedApplication.universityAddress}</p>
                </div>

                <div className="bg-[#6AECE1]/10 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Feedback</p>
                  <p className="text-gray-800">{selectedApplication.feedback || 'No feedback yet'}</p>
                </div>
              </div>

              <div className="modal-action">
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="btn bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] text-white border-0 hover:opacity-90"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="modal modal-open"
            onClick={() => setShowReviewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="modal-box bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="font-bold text-2xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#26CCC2] to-[#6AECE1]">
                Add Review for {selectedApplication.scholarshipName}
              </h3>

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
                        name="rating"
                        className="mask mask-star-2 bg-[#FFB76C] cursor-pointer hover:scale-110 transition-transform"
                        checked={reviewData.ratingPoint === star}
                        onChange={() => setReviewData({ ...reviewData, ratingPoint: star })}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">Selected: {reviewData.ratingPoint} {reviewData.ratingPoint === 1 ? 'star' : 'stars'}</p>
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700">
                      Review Comment <span className="text-red-500">*</span>
                    </span>
                    <span className="label-text-alt text-gray-500">
                      {reviewData.reviewComment.length}/500
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered w-full h-32 focus:outline-none focus:ring-2 focus:ring-[#26CCC2] border-2 border-gray-200 hover:border-[#6AECE1] transition-colors resize-none"
                    placeholder="Share your experience with this scholarship... (minimum 10 characters)"
                    value={reviewData.reviewComment}
                    onChange={(e) => {
                      if (e.target.value.length <= 500) {
                        setReviewData({ ...reviewData, reviewComment: e.target.value });
                      }
                    }}
                    maxLength={500}
                    required
                  ></textarea>
                  {reviewData.reviewComment.trim().length > 0 && reviewData.reviewComment.trim().length < 10 && (
                    <p className="text-xs text-red-500 mt-1">Comment must be at least 10 characters</p>
                  )}
                </div>
              </div>

              <div className="modal-action">
                <button
                  onClick={() => {
                    setShowReviewModal(false);
                    setReviewData({ ratingPoint: 5, reviewComment: '' });
                  }}
                  className="btn btn-outline border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="btn bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] text-white border-0 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!reviewData.reviewComment.trim() || reviewData.reviewComment.trim().length < 10}
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyApplications;
