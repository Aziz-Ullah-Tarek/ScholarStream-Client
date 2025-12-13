import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiXCircle, FiArrowLeft, FiRefreshCw, FiAlertTriangle } from 'react-icons/fi';
import { FaUniversity } from 'react-icons/fa';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

const PaymentFailure = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const errorMessage = searchParams.get('error') || 'Payment could not be processed';

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

  const handleRetryPayment = () => {
    if (application) {
      navigate(`/checkout/${application.scholarshipId}`);
    } else {
      navigate('/scholarships');
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading payment details..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50/50 via-white to-orange-50/50 flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* Failure Animation */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-8"
        >
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-red-400 to-orange-600 rounded-full flex items-center justify-center shadow-2xl">
              <FiXCircle className="text-white" size={64} />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1.5, opacity: 0 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="absolute inset-0 bg-red-400 rounded-full"
            />
          </div>
        </motion.div>

        {/* Failure Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-red-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-orange-600 px-8 py-6 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Payment Failed
            </h1>
            <p className="text-red-50 text-lg">
              We couldn't process your payment
            </p>
          </div>

          {/* Content */}
          <div className="p-8 space-y-6">
            {/* Error Message */}
            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl p-6 border-2 border-red-200">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shrink-0">
                  <FiAlertTriangle className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-red-800 mb-2">Error Details</h3>
                  <p className="text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>

            {/* Scholarship Information */}
            {application && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Scholarship Details</h2>

                {/* Scholarship Name */}
                <div className="flex items-start gap-4 p-4 bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-200">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-500 to-gray-700 flex items-center justify-center shrink-0">
                    <FaUniversity className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">Scholarship</p>
                    <p className="text-lg font-bold text-gray-800">{application.scholarshipName}</p>
                    <p className="text-sm text-gray-600 mt-1">{application.universityName}</p>
                  </div>
                </div>

                {/* Payment Amount */}
                <div className="p-4 bg-gradient-to-br from-orange-50 to-white rounded-xl border border-orange-200">
                  <p className="text-sm text-gray-600 font-medium mb-2">Payment Amount</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-600 bg-clip-text text-transparent">
                    ${application.totalPaid}
                  </p>
                </div>
              </div>
            )}

            {/* Common Reasons */}
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="font-bold text-blue-800 mb-3">Common Reasons for Payment Failure:</h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Insufficient funds in your account</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Incorrect card details (number, expiry, CVV)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Card declined by your bank</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Network or connection issues</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  <span>Card not enabled for online transactions</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-6 space-y-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRetryPayment}
                className="btn w-full bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] hover:from-[#26CCC2] hover:to-[#FFB76C] text-white border-none text-lg py-4 h-auto rounded-xl shadow-lg"
              >
                <FiRefreshCw size={20} />
                Retry Payment
              </motion.button>

              <button
                onClick={() => navigate('/dashboard/my-applications')}
                className="btn btn-outline w-full border-2 border-gray-300 hover:border-[#26CCC2] hover:bg-[#6AECE1]/10 text-gray-700 hover:text-[#26CCC2] rounded-xl"
              >
                <FiArrowLeft size={20} />
                Return to Dashboard
              </button>

              <button
                onClick={() => navigate('/scholarships')}
                className="btn btn-ghost w-full text-gray-600 hover:text-[#26CCC2] rounded-xl"
              >
                Browse Other Scholarships
              </button>
            </div>

            {/* Help Section */}
            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl p-4 border border-purple-200">
              <p className="text-sm text-purple-800">
                <strong>Need Help?</strong> If you continue to experience payment issues, please 
                contact your bank or try using a different payment method. You can also reach out 
                to our support team for assistance.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PaymentFailure;
