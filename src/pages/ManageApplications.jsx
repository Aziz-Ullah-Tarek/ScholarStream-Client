import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiEye, FiMessageSquare, FiCheck, FiX, FiEdit2, FiClock, FiCheckCircle, FiXCircle, FiDollarSign, FiMail, FiUser, FiBook, FiCalendar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import LoadingSpinner from '../components/LoadingSpinner';

const ManageApplications = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get('http://localhost:5000/api/applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      toast.error('Failed to fetch applications');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appId, newStatus) => {
    try {
      setUpdatingStatus(appId);
      const token = await user.getIdToken();
      await axios.patch(
        `http://localhost:5000/api/applications/${appId}/status`,
        { applicationStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Application status updated to ${newStatus}`);
      fetchApplications();
    } catch (error) {
      toast.error('Failed to update status');
      console.error(error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback.trim()) {
      toast.error('Please enter feedback');
      return;
    }

    try {
      const token = await user.getIdToken();
      await axios.patch(
        `http://localhost:5000/api/applications/${selectedApp._id}/status`,
        { 
          applicationStatus: selectedApp.applicationStatus,
          feedback: feedback.trim()
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Feedback submitted successfully');
      setShowFeedbackModal(false);
      setFeedback('');
      setSelectedApp(null);
      fetchApplications();
    } catch (error) {
      toast.error('Failed to submit feedback');
      console.error(error);
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.universityName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || app.applicationStatus === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-[#FFF57E]/20 text-[#FFB76C] border-[#FFF57E]';
      case 'processing':
        return 'bg-[#26CCC2]/20 text-[#26CCC2] border-[#26CCC2]';
      case 'completed':
        return 'bg-[#6AECE1]/20 text-[#26CCC2] border-[#6AECE1]';
      case 'rejected':
        return 'bg-red-100 text-red-600 border-red-300';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };

  const getPaymentStatusColor = (status) => {
    return status === 'paid' 
      ? 'bg-[#6AECE1]/20 text-[#26CCC2] border-[#6AECE1]' 
      : 'bg-[#FFB76C]/20 text-[#FFB76C] border-[#FFF57E]';
  };

  if (loading) {
    return <LoadingSpinner message="Loading applications..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-lg p-6 border-2 border-[#6AECE1]"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] bg-clip-text text-transparent">
          Manage Applications
        </h1>
        <p className="text-gray-600 mt-2">Review and manage all student scholarship applications</p>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#6AECE1]"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by name, email, or university..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full border-[#6AECE1] focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#26CCC2]/20 rounded-xl"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select select-bordered border-[#6AECE1] focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#26CCC2]/20 rounded-xl"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="mt-4 flex gap-2 flex-wrap">
          <span className="text-sm text-gray-600">Total: <strong>{filteredApplications.length}</strong></span>
          <span className="text-sm text-[#FFB76C]">Pending: <strong>{applications.filter(a => a.applicationStatus === 'pending').length}</strong></span>
          <span className="text-sm text-[#26CCC2]">Processing: <strong>{applications.filter(a => a.applicationStatus === 'processing').length}</strong></span>
          <span className="text-sm text-[#6AECE1]">Completed: <strong>{applications.filter(a => a.applicationStatus === 'completed').length}</strong></span>
          <span className="text-sm text-red-500">Rejected: <strong>{applications.filter(a => a.applicationStatus === 'rejected').length}</strong></span>
        </div>
      </motion.div>

      {/* Applications Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-[#6AECE1]"
      >
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="bg-gradient-to-r from-[#6AECE1] to-[#26CCC2] text-white">
              <tr>
                <th>Applicant Name</th>
                <th>Applicant Email</th>
                <th>University Name</th>
                <th>Application Feedback</th>
                <th>Application Status</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No applications found
                  </td>
                </tr>
              ) : (
                filteredApplications.map((app) => (
                  <tr key={app._id} className="hover:bg-[#6AECE1]/5">
                    <td className="font-semibold">{app.userName}</td>
                    <td className="text-gray-600">{app.userEmail}</td>
                    <td className="font-medium">{app.universityName}</td>
                    <td>
                      {app.feedback ? (
                        <span className="text-sm text-gray-600 line-clamp-2">{app.feedback}</span>
                      ) : (
                        <span className="text-gray-400 text-sm italic">No feedback yet</span>
                      )}
                    </td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(app.applicationStatus)}`}>
                        {app.applicationStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getPaymentStatusColor(app.paymentStatus)}`}>
                        {app.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        {/* Details Button */}
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setShowDetailsModal(true);
                          }}
                          className="btn btn-sm bg-gradient-to-r from-[#6AECE1] to-[#26CCC2] text-white border-none hover:from-[#26CCC2] hover:to-[#6AECE1]"
                          title="View Details"
                        >
                          <FiEye size={16} />
                        </button>

                        {/* Feedback Button */}
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setFeedback(app.feedback || '');
                            setShowFeedbackModal(true);
                          }}
                          className="btn btn-sm bg-gradient-to-r from-[#FFF57E] to-[#FFB76C] text-white border-none hover:from-[#FFB76C] hover:to-[#FFF57E]"
                          title="Add Feedback"
                        >
                          <FiMessageSquare size={16} />
                        </button>

                        {/* Status Dropdown */}
                        {app.applicationStatus !== 'rejected' && app.applicationStatus !== 'completed' && (
                          <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-sm bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] text-white border-none">
                              <FiEdit2 size={16} />
                            </label>
                            <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-xl w-48 border-2 border-[#6AECE1]">
                              {app.applicationStatus === 'pending' && (
                                <li>
                                  <button
                                    onClick={() => handleStatusUpdate(app._id, 'processing')}
                                    disabled={updatingStatus === app._id}
                                    className="hover:bg-[#26CCC2]/10"
                                  >
                                    <FiClock className="text-[#26CCC2]" />
                                    Set Processing
                                  </button>
                                </li>
                              )}
                              {app.applicationStatus === 'processing' && (
                                <li>
                                  <button
                                    onClick={() => handleStatusUpdate(app._id, 'completed')}
                                    disabled={updatingStatus === app._id}
                                    className="hover:bg-[#6AECE1]/10"
                                  >
                                    <FiCheckCircle className="text-[#26CCC2]" />
                                    Set Completed
                                  </button>
                                </li>
                              )}
                            </ul>
                          </div>
                        )}

                        {/* Cancel/Reject Button */}
                        {app.applicationStatus !== 'rejected' && app.applicationStatus !== 'completed' && (
                          <button
                            onClick={() => handleStatusUpdate(app._id, 'rejected')}
                            disabled={updatingStatus === app._id}
                            className="btn btn-sm bg-gradient-to-r from-red-500 to-red-600 text-white border-none hover:from-red-600 hover:to-red-700"
                            title="Reject Application"
                          >
                            <FiXCircle size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Details Modal */}
      {showDetailsModal && selectedApp && (
        <div className="modal modal-open">
          <div className="modal-box max-w-3xl bg-white border-2 border-[#6AECE1]">
            <div className="bg-gradient-to-r from-[#6AECE1] to-[#26CCC2] -mx-6 -mt-6 px-6 py-4 mb-6 rounded-t-2xl">
              <h3 className="font-bold text-2xl text-white flex items-center gap-2">
                <FiEye size={24} />
                Application Details
              </h3>
            </div>

            <div className="space-y-6">
              {/* Applicant Information */}
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-[#26CCC2] border-b-2 border-[#6AECE1] pb-2">
                  Applicant Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-[#6AECE1]/10 rounded-xl">
                    <FiUser className="text-[#26CCC2]" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-semibold">{selectedApp.userName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#6AECE1]/10 rounded-xl">
                    <FiMail className="text-[#26CCC2]" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-semibold">{selectedApp.userEmail}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scholarship Information */}
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-[#26CCC2] border-b-2 border-[#6AECE1] pb-2">
                  Scholarship Information
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-[#FFF57E]/10 rounded-xl">
                    <FiBook className="text-[#FFB76C]" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">University</p>
                      <p className="font-semibold">{selectedApp.universityName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#FFF57E]/10 rounded-xl">
                    <FiBook className="text-[#FFB76C]" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Category</p>
                      <p className="font-semibold">{selectedApp.scholarshipCategory}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#FFF57E]/10 rounded-xl">
                    <FiBook className="text-[#FFB76C]" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Degree</p>
                      <p className="font-semibold">{selectedApp.degree}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#FFF57E]/10 rounded-xl">
                    <FiCalendar className="text-[#FFB76C]" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Applied Date</p>
                      <p className="font-semibold">
                        {new Date(selectedApp.applicationDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Financial Information */}
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-[#26CCC2] border-b-2 border-[#6AECE1] pb-2">
                  Financial Information
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-[#26CCC2]/10 rounded-xl">
                    <FiDollarSign className="text-[#26CCC2]" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Application Fees</p>
                      <p className="font-semibold">${selectedApp.applicationFees}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#26CCC2]/10 rounded-xl">
                    <FiDollarSign className="text-[#26CCC2]" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Service Charge</p>
                      <p className="font-semibold">${selectedApp.serviceCharge}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-[#26CCC2]/10 rounded-xl">
                    <FiDollarSign className="text-[#26CCC2]" size={20} />
                    <div>
                      <p className="text-xs text-gray-500">Payment Status</p>
                      <p className="font-semibold capitalize">{selectedApp.paymentStatus}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Feedback */}
              <div className="space-y-3">
                <h4 className="font-bold text-lg text-[#26CCC2] border-b-2 border-[#6AECE1] pb-2">
                  Status & Feedback
                </h4>
                <div className="space-y-3">
                  <div className="p-4 bg-[#6AECE1]/10 rounded-xl">
                    <p className="text-xs text-gray-500 mb-1">Application Status</p>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(selectedApp.applicationStatus)}`}>
                      {selectedApp.applicationStatus}
                    </span>
                  </div>
                  {selectedApp.feedback && (
                    <div className="p-4 bg-[#FFF57E]/10 rounded-xl">
                      <p className="text-xs text-gray-500 mb-2">Moderator Feedback</p>
                      <p className="text-gray-700">{selectedApp.feedback}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="btn bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] text-white border-none"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && selectedApp && (
        <div className="modal modal-open">
          <div className="modal-box bg-white border-2 border-[#6AECE1]">
            <div className="bg-gradient-to-r from-[#FFF57E] to-[#FFB76C] -mx-6 -mt-6 px-6 py-4 mb-6 rounded-t-2xl">
              <h3 className="font-bold text-2xl text-white flex items-center gap-2">
                <FiMessageSquare size={24} />
                Application Feedback
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Applicant: <strong>{selectedApp.userName}</strong></p>
                <p className="text-sm text-gray-600">University: <strong>{selectedApp.universityName}</strong></p>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">Feedback Message</span>
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="textarea textarea-bordered h-32 border-[#6AECE1] focus:border-[#FFB76C] focus:outline-none focus:ring-2 focus:ring-[#FFB76C]/20"
                  placeholder="Enter your feedback for the applicant..."
                />
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => {
                  setShowFeedbackModal(false);
                  setFeedback('');
                  setSelectedApp(null);
                }}
                className="btn btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleFeedbackSubmit}
                className="btn bg-gradient-to-r from-[#FFF57E] to-[#FFB76C] text-white border-none"
              >
                Submit Feedback
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageApplications;
