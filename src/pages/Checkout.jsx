import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  FiCreditCard,
  FiDollarSign,
  FiCheck,
  FiAlertCircle,
  FiArrowLeft,
  FiShield,
  FiLock
} from 'react-icons/fi';
import { FaUniversity, FaStripe } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import API_URL from '../config/api';

// Initialize Stripe
console.log('Stripe Key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? 'Loaded' : 'Missing');
console.log('API URL:', API_URL);
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Card Element styling
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      fontFamily: 'system-ui, -apple-system, sans-serif',
    },
    invalid: {
      color: '#ef4444',
      iconColor: '#ef4444',
    },
  },
  hidePostalCode: true,
};

// Payment Form Component (needs to be inside Elements provider)
const PaymentForm = ({ scholarship, totalAmount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [processing, setProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [cardholderName, setCardholderName] = useState(user?.displayName || '');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error('Stripe has not loaded yet');
      return;
    }

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (!cardholderName.trim()) {
      toast.error('Please enter cardholder name');
      return;
    }

    setProcessing(true);

    try {
      console.log('[Payment] Starting payment process...');
      console.log('[Payment] User:', user?.email);
      console.log('[Payment] Amount:', totalAmount);
      console.log('[Payment] Scholarship:', scholarship.scholarshipName);
      
      const token = await user.getIdToken();
      console.log('[Payment] Firebase token obtained:', token ? 'Yes' : 'No');

      // Create payment intent on backend
      console.log('[Payment] Creating payment intent...');
      const paymentIntentResponse = await axios.post(
        `${API_URL}/api/create-payment-intent`,
        {
          amount: totalAmount,
          scholarshipName: scholarship.scholarshipName
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('[Payment] Payment intent created:', paymentIntentResponse.data);

      const { clientSecret } = paymentIntentResponse.data;

      // Confirm card payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name: cardholderName,
            email: user.email,
          },
        },
      });

      if (error) {
        // Payment failed - save application with unpaid status
        const failedApplicationData = {
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
          applicationStatus: 'payment-pending',
          paymentMethod: 'stripe',
          paymentStatus: 'unpaid',
          totalPaid: totalAmount,
          paymentError: error.message
        };

        try {
          const failedResponse = await axios.post(
            `${API_URL}/api/applications`,
            failedApplicationData,
            {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }
          );

          // Redirect to failure page with application ID
          navigate(`/payment-failure?applicationId=${failedResponse.data.insertedId}&error=${encodeURIComponent(error.message)}`);
        } catch (saveError) {
          console.error('Error saving failed application:', saveError);
          navigate(`/payment-failure?error=${encodeURIComponent(error.message)}`);
        }
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // Create application with payment data
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
          paymentMethod: 'stripe',
          paymentStatus: 'paid',
          totalPaid: totalAmount,
          stripePaymentIntentId: paymentIntent.id
        };

        const response = await axios.post(
          `${API_URL}/api/applications`,
          applicationData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );

        if (response.data) {
          // Redirect to success page with application ID
          navigate(`/payment-success?applicationId=${response.data.insertedId}`);
        }
      }
    } catch (error) {
      console.error('[Payment] Payment error:', error);
      console.error('[Payment] Error response:', error.response);
      console.error('[Payment] Error data:', error.response?.data);
      console.error('[Payment] Error message:', error.message);
      console.error('[Payment] Full error object:', JSON.stringify(error.response?.data, null, 2));
      
      let errorMessage = 'Payment failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
        console.error('[Payment] Backend error message:', errorMessage);
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
        console.error('[Payment] Backend error:', errorMessage);
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      // Check for common errors
      if (error.message?.includes('getIdToken')) {
        errorMessage = 'Authentication error. Please log in again.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error. Please try again or contact support.';
      }
      
      toast.error(`Payment Error: ${errorMessage}`);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Stripe Logo */}
      <div className="flex items-center justify-center gap-3 p-4 bg-gradient-to-br from-indigo-50 to-white rounded-2xl border-2 border-indigo-200">
        <FaStripe size={40} className="text-indigo-600" />
        <div className="text-left">
          <p className="font-semibold text-gray-800">Stripe Payment</p>
          <p className="text-sm text-gray-600">Secure & Encrypted</p>
        </div>
      </div>

      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          placeholder="John Doe"
          className="input input-bordered w-full rounded-xl focus:border-[#26CCC2] focus:outline-none"
          disabled={processing}
          required
        />
      </div>

      {/* Stripe Card Element */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
          <FiLock className="text-green-500" />
          Card Information
        </label>
        <div className="p-4 border-2 border-gray-200 rounded-xl focus-within:border-[#26CCC2] transition-colors bg-white">
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Test card: 4242 4242 4242 4242 | Exp: Any future date | CVC: Any 3 digits
        </p>
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
        disabled={processing || !agreedToTerms || !stripe}
        whileHover={{ scale: agreedToTerms && !processing ? 1.02 : 1 }}
        whileTap={{ scale: agreedToTerms && !processing ? 0.98 : 1 }}
        className={`btn w-full text-lg py-4 h-auto rounded-2xl shadow-lg transition-all ${
          agreedToTerms && !processing && stripe
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
        <span>Your payment information is secure and encrypted with Stripe</span>
      </div>
    </form>
  );
};

const Checkout = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [scholarship, setScholarship] = useState(null);
  const [loading, setLoading] = useState(true);

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
      const response = await axios.get(`${API_URL}/api/scholarships/${id}`);
      setScholarship(response.data);
    } catch (error) {
      console.error('Error fetching scholarship:', error);
      toast.error('Failed to load scholarship details');
      navigate('/scholarships');
    } finally {
      setLoading(false);
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

              {/* Stripe Elements Payment Form */}
              <Elements stripe={stripePromise}>
                <PaymentForm 
                  scholarship={scholarship} 
                  totalAmount={totalAmount}
                />
              </Elements>
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
