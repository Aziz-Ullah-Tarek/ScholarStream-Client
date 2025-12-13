import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiArrowRight, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { FaUniversity, FaGraduationCap } from 'react-icons/fa';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import API_URL from '../config/api';

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const applicationId = searchParams.get('applicationId');
    if (applicationId) {
      fetchApplicationDetails(applicationId);
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const fetchApplicationDetails = async (id) => {
    try {
      const response = await axios.get(`${API_URL}/api/applications/${id}`);
      setApplication(response.data);
    } catch (error) {
      console.error('Error fetching application:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading payment details..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6AECE1]/10 via-white to-[#FFF57E]/10 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Success Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center shadow-2xl">
              <FiCheckCircle className="text-white" size={64} />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="absolute inset-0 bg-green-400 rounded-full"
            />
          </div>
        </motion.div>

        {/* Success Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-green-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Payment Successful! 🎉
            </h1>
            <p className="text-green-50 text-lg">
              Your scholarship application has been submitted
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {application ? (
              <>
                {/* Application Details */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">Application Details</h2>

                  {/* Scholarship Name */}
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-blue-50 to-white rounded-xl border border-blue-200">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shrink-0">
                      <FaGraduationCap className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-medium">Scholarship</p>
                      <p className="text-lg font-bold text-gray-800">{application.scholarshipName}</p>
                    </div>
                  </div>

                  {/* University Name */}
                  <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-purple-50 to-white rounded-xl border border-purple-200">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shrink-0">
                      <FaUniversity className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 font-medium">University</p>
                      <p className="text-lg font-bold text-gray-800">{application.universityName}</p>
                      <p className="text-sm text-gray-600 mt-1">{application.universityCountry}</p>
                    </div>
                  </div>

                  {/* Degree & Subject */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-gradient-to-br from-[#6AECE1]/10 to-white rounded-xl border border-[#6AECE1]/30">
                      <p className="text-sm text-gray-600 font-medium mb-1">Degree Level</p>
                      <p className="text-lg font-bold text-gray-800">{application.degree}</p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-[#FFF57E]/10 to-white rounded-xl border border-[#FFB76C]/30">
                      <p className="text-sm text-gray-600 font-medium mb-1">Subject</p>
                      <p className="text-lg font-bold text-gray-800">{application.subjectCategory}</p>
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FiDollarSign className="text-green-500" />
                    Payment Information
                  </h3>
                  
                  <div className="bg-gradient-to-br from-green-50 to-white rounded-xl p-6 border border-green-200">
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-700">
                        <span>Application Fee</span>
                        <span className="font-semibold">${application.applicationFees}</span>
                      </div>
                      <div className="flex justify-between text-gray-700">
                        <span>Service Charge</span>
                        <span className="font-semibold">${application.serviceCharge}</span>
                      </div>
                      <div className="h-px bg-gray-200"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-gray-800">Total Paid</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
                          ${application.totalPaid}
                        </span>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="mt-4 pt-4 border-t border-green-200">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Payment Status</span>
                        <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                          ✓ Paid
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600">Application Status</span>
                        <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-full text-sm font-semibold">
                          Pending Review
                        </span>
                      </div>
                      {application.stripePaymentIntentId && (
                        <div className="mt-3">
                          <p className="text-xs text-gray-500">
                            Transaction ID: {application.stripePaymentIntentId}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-600 justify-center">
                  <FiCalendar size={16} />
                  <span>
                    Submitted on {new Date(application.applicationDate || Date.now()).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">
                  Your payment was successful and your application has been submitted!
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-6 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/dashboard/my-applications')}
                className="btn w-full bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] hover:from-[#26CCC2] hover:to-[#FFB76C] text-white border-none text-lg py-4 h-auto rounded-xl shadow-lg"
              >
                <FiArrowRight size={20} />
                Go to My Applications
              </motion.button>

              <button
                onClick={() => navigate('/scholarships')}
                className="btn btn-outline w-full border-2 border-gray-300 hover:border-[#26CCC2] hover:bg-[#6AECE1]/10 text-gray-700 hover:text-[#26CCC2] rounded-xl"
              >
                Browse More Scholarships
              </button>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>What's Next?</strong> Your application is being reviewed by the university. 
                You'll receive email notifications about your application status. You can track 
                your application progress in the "My Applications" section.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;
