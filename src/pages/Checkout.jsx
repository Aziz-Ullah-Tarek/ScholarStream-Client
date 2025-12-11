import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  FiCreditCard,
  FiDollarSign,
  FiCheck,
  FiAlertCircle,
  FiArrowLeft,
  FiShield,
  FiLock
} from 'react-icons/fi';
import { FaUniversity, FaPaypal, FaStripe } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('stripe');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  useEffect(() => {
    if (!user) {
      toast.error('Please login to continue');
      navigate('/login');
      return;
    }
    fetchScholarshipDetails();
  }, [id, user]);

  const fetchScholarshipDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/scholarships/${id}`);
      setScholarship(response.data);
    } catch (error) {
      console.error('Error fetching scholarship:', error);
      toast.error('Failed to load scholarship details');
      navigate('/scholarships');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setProcessing(true);

    try {
      const token = await user.getIdToken();
      
      // Create application with payment
      const applicationData = {
        scholarshipId: scholarship._id,
        scholarshipName: scholarship.scholarshipName,
        universityName: scholarship.universityName,
        universityImage: scholarship.universityImage,
        universityCountry: scholarship.universityCountry,
        degree: scholarship.degree,
        subjectCategory: scholarship.subjectCategory,
        applicationFees: scholarship.applicationFees,
        serviceCharge: scholarship.serviceCharge,
        userEmail: user.email,
        userName: user.displayName || 'Anonymous',
        userPhoto: user.photoURL || '',
        phone: '',
        address: '',
        studyGap: '',
        gender: '',
        sscResult: '',
        hscResult: '',
        applicationStatus: 'pending',
        paymentMethod: paymentMethod,
        paymentStatus: 'completed',
        totalPaid: scholarship.applicationFees + scholarship.serviceCharge
      };

      const response = await axios.post(
        'http://localhost:5000/api/applications',
        applicationData,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.data) {
        toast.success('🎉 Payment successful! Application submitted.');
        navigate('/dashboard/my-applications');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(error.response?.data?.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading checkout..." />;
  }

  if (!scholarship) {
    return null;
  }

  const totalAmount = scholarship.applicationFees + scholarship.serviceCharge;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6AECE1]/10 via-white to-[#FFF57E]/10 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(`/scholarship/${id}`)}
          className="flex items-center gap-2 text-[#26CCC2] hover:text-[#FFB76C] font-semibold mb-6 transition-colors"
        >
          <FiArrowLeft size={20} />
          Back to Scholarship Details
        </motion.button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 border-2 border-[#6AECE1]/30"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] flex items-center justify-center">
                  <FiCreditCard className="text-white" size={24} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800">Payment Checkout</h1>
              </div>

              <form onSubmit={handlePayment} className="space-y-8">
                {/* Payment Method Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-4">
                    Select Payment Method
                  </label>
                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Stripe */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setPaymentMethod('stripe')}
                      className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                        paymentMethod === 'stripe'
                          ? 'border-[#26CCC2] bg-gradient-to-br from-[#6AECE1]/10 to-white shadow-lg'
                          : 'border-gray-200 hover:border-[#6AECE1]/50'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <FaStripe size={40} className="text-indigo-600" />
                        <span className="font-semibold text-gray-800">Stripe</span>
                        {paymentMethod === 'stripe' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] flex items-center justify-center"
                          >
                            <FiCheck className="text-white" size={14} />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    {/* PayPal */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setPaymentMethod('paypal')}
                      className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                        paymentMethod === 'paypal'
                          ? 'border-[#26CCC2] bg-gradient-to-br from-[#6AECE1]/10 to-white shadow-lg'
                          : 'border-gray-200 hover:border-[#6AECE1]/50'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <FaPaypal size={40} className="text-blue-600" />
                        <span className="font-semibold text-gray-800">PayPal</span>
                        {paymentMethod === 'paypal' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] flex items-center justify-center"
                          >
                            <FiCheck className="text-white" size={14} />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    {/* Credit Card */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      onClick={() => setPaymentMethod('credit-card')}
                      className={`cursor-pointer p-6 rounded-2xl border-2 transition-all ${
                        paymentMethod === 'credit-card'
                          ? 'border-[#26CCC2] bg-gradient-to-br from-[#6AECE1]/10 to-white shadow-lg'
                          : 'border-gray-200 hover:border-[#6AECE1]/50'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <FiCreditCard size={40} className="text-green-600" />
                        <span className="font-semibold text-gray-800">Card</span>
                        {paymentMethod === 'credit-card' && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-6 h-6 rounded-full bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] flex items-center justify-center"
                          >
                            <FiCheck className="text-white" size={14} />
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Card Details (Simulated) */}
                <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiLock className="text-green-500" />
                    Secure Payment Information
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="input input-bordered w-full rounded-xl focus:border-[#26CCC2] focus:outline-none"
                        disabled={processing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="input input-bordered w-full rounded-xl focus:border-[#26CCC2] focus:outline-none"
                        disabled={processing}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="input input-bordered w-full rounded-xl focus:border-[#26CCC2] focus:outline-none"
                        disabled={processing}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="input input-bordered w-full rounded-xl focus:border-[#26CCC2] focus:outline-none"
                        disabled={processing}
                      />
                    </div>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="checkbox checkbox-sm border-[#26CCC2] [--chkbg:#26CCC2] [--chkfg:white] mt-1"
                    disabled={processing}
                  />
                  <label className="text-sm text-gray-700">
                    I agree to the{' '}
                    <a href="#" className="text-[#26CCC2] font-semibold hover:text-[#FFB76C]">
                      Terms and Conditions
                    </a>{' '}
                    and{' '}
                    <a href="#" className="text-[#26CCC2] font-semibold hover:text-[#FFB76C]">
                      Privacy Policy
                    </a>
                    . I understand that the application fee is non-refundable once submitted.
                  </label>
                </div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={processing || !agreedToTerms}
                  whileHover={{ scale: agreedToTerms ? 1.02 : 1 }}
                  whileTap={{ scale: agreedToTerms ? 0.98 : 1 }}
                  className={`btn w-full text-lg py-4 h-auto rounded-2xl shadow-lg transition-all ${
                    agreedToTerms && !processing
                      ? 'bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] hover:from-[#26CCC2] hover:to-[#FFB76C] text-white border-none'
                      : 'bg-gray-300 text-gray-500 border-none cursor-not-allowed'
                  }`}
                >
                  {processing ? (
                    <>
                      <span className="loading loading-spinner"></span>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <FiShield size={24} />
                      Pay ${totalAmount.toFixed(2)} Securely
                    </>
                  )}
                </motion.button>

                {/* Security Notice */}
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <FiLock size={16} />
                  <span>Your payment information is secure and encrypted</span>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="sticky top-24 bg-white rounded-3xl shadow-xl p-8 border-2 border-[#6AECE1]/30"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>

              {/* Scholarship Info */}
              <div className="mb-6 pb-6 border-b border-gray-200">
                <img
                  src={scholarship.universityImage}
                  alt={scholarship.universityName}
                  className="w-full h-40 object-cover rounded-xl mb-4"
                />
                <div className="flex items-start gap-2 mb-2">
                  <FaUniversity className="text-[#26CCC2] flex-shrink-0 mt-1" size={18} />
                  <p className="font-semibold text-gray-800">{scholarship.universityName}</p>
                </div>
                <p className="text-sm text-gray-600 ml-7">{scholarship.scholarshipName}</p>
              </div>

              {/* Cost Breakdown */}
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Application Fee</span>
                  <span className="font-semibold">${scholarship.applicationFees}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Service Charge</span>
                  <span className="font-semibold">${scholarship.serviceCharge}</span>
                </div>
                <div className="h-px bg-gray-200"></div>
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-800">Total Amount</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] bg-clip-text text-transparent">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Important Notice */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-4 border border-yellow-200">
                <div className="flex items-start gap-3">
                  <FiAlertCircle className="text-orange-500 flex-shrink-0 mt-0.5" size={20} />
                  <div className="text-sm">
                    <p className="font-semibold text-orange-800 mb-1">Important Notice</p>
                    <p className="text-orange-700">
                      Application fees are non-refundable. Please review all details before confirming payment.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
