import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaSearch, FaMapMarkerAlt, FaGraduationCap, FaDollarSign, FaCalendarAlt } from 'react-icons/fa';

const Home = () => {
  const [scholarships, setScholarships] = useState([]);
  const [successStories, setSuccessStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storiesLoading, setStoriesLoading] = useState(true);

  useEffect(() => {
    fetchTopScholarships();
    fetchSuccessStories();
  }, []);

  const fetchTopScholarships = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/scholarships');
      // Sort by application fees (lowest first) and get top 6
      const sorted = response.data.sort((a, b) => a.applicationFees - b.applicationFees).slice(0, 6);
      setScholarships(sorted);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSuccessStories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/success-stories');
      setSuccessStories(response.data);
    } catch (error) {
      console.error('Error fetching success stories:', error);
    } finally {
      setStoriesLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Banner */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-[#6AECE1] via-[#26CCC2] to-[#6AECE1] text-white py-20"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Your Journey to <span className="text-[#FFF57E]">Success</span> Starts Here
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Discover thousands of scholarship opportunities worldwide and make your dreams come true
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                to="/scholarships"
                className="btn bg-white text-[#26CCC2] hover:bg-gradient-to-r hover:from-[#FFB76C] hover:to-[#FFF57E] hover:text-white border-0 px-8 py-3 text-lg font-semibold rounded-full shadow-2xl inline-flex items-center gap-2 transition-all duration-300"
              >
                <FaSearch /> Search Scholarships
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Top Scholarships Section */}
      <section className="py-16 bg-base-100">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Top Scholarships</h2>
            <p className="text-lg text-gray-600">Explore the most affordable scholarship opportunities</p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg text-blue-500"></span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {scholarships.map((scholarship, index) => (
                <motion.div
                  key={scholarship._id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  className="card bg-white shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-[#6AECE1]/30 hover:border-[#26CCC2]"
                >
                  <figure className="h-48 overflow-hidden relative">
                    <img
                      src={scholarship.universityImage}
                      alt={scholarship.universityName}
                      className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#26CCC2]/20 to-transparent"></div>
                  </figure>
                  <div className="card-body p-5">
                    <div className="badge bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] text-white border-0 badge-sm font-semibold">{scholarship.scholarshipCategory}</div>
                    <h3 className="card-title text-lg font-bold text-gray-800">
                      {scholarship.scholarshipName}
                    </h3>
                    <p className="text-gray-600 text-sm font-semibold flex items-center gap-2">
                      <FaGraduationCap className="text-[#26CCC2]" />
                      {scholarship.universityName}
                    </p>
                    <p className="text-gray-500 text-sm flex items-center gap-2">
                      <FaMapMarkerAlt className="text-[#FFB76C]" />
                      {scholarship.universityCity}, {scholarship.universityCountry}
                    </p>
                    <div className="divider my-2"></div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <FaDollarSign className="text-green-500" />
                        <strong>${scholarship.applicationFees}</strong>
                      </span>
                      <span className="badge badge-outline badge-sm">{scholarship.degree}</span>
                    </div>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-2">
                      <FaCalendarAlt />
                      Deadline: {new Date(scholarship.applicationDeadline).toLocaleDateString()}
                    </p>
                    <div className="card-actions mt-4">
                      <Link
                        to={`/scholarship/${scholarship._id}`}
                        className="btn bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] hover:from-[#FFB76C] hover:to-[#FFF57E] text-white border-0 btn-sm w-full shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-16 bg-gradient-to-br from-[#6AECE1]/10 via-[#26CCC2]/10 to-[#6AECE1]/10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600">Hear from students who achieved their dreams through scholarships</p>
          </motion.div>

          {storiesLoading ? (
            <div className="flex justify-center items-center py-20">
              <span className="loading loading-spinner loading-lg text-blue-500"></span>
            </div>
          ) : successStories.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No success stories available yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {successStories.map((story, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="card bg-white shadow-xl"
              >
                <div className="card-body items-center text-center">
                  <div className="avatar mb-4">
                    <div className="w-24 rounded-full ring-4 ring-[#26CCC2] ring-offset-2">
                      <img src={story.studentImage} alt={story.studentName} />
                    </div>
                  </div>
                  <h3 className="card-title text-xl">{story.studentName}</h3>
                  <p className="text-sm text-gray-500">{story.studentCountry}</p>
                  <div className="badge bg-gradient-to-r from-[#FFB76C] to-[#FFF57E] text-white border-0 badge-sm mt-2 font-semibold">{story.scholarshipName}</div>
                  <p className="text-gray-600 mt-4 italic">"{story.story}"</p>
                  <div className="rating rating-sm mt-4">
                    {[...Array(5)].map((_, i) => (
                      <input key={i} type="radio" className="mask mask-star-2 bg-yellow-400" checked={i === story.rating - 1} readOnly />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600">Get answers to common questions about scholarships</p>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                question: "How do I apply for scholarships?",
                answer: "Simply browse our scholarships, click 'View Details' on any scholarship, and follow the application process. You'll need to create an account and pay the application fee."
              },
              {
                question: "Are there any hidden fees?",
                answer: "No hidden fees! The application fee and service charge are clearly displayed for each scholarship. What you see is what you pay."
              },
              {
                question: "Can I apply for multiple scholarships?",
                answer: "Yes! You can apply for as many scholarships as you want. We recommend applying to multiple opportunities to increase your chances."
              },
              {
                question: "How long does the review process take?",
                answer: "Review times vary by scholarship and institution. Typically, you'll hear back within 4-8 weeks. You can track your application status in your dashboard."
              },
              {
                question: "What happens after I'm accepted?",
                answer: "Congratulations! The university will contact you directly with next steps, including enrollment procedures and visa requirements if applicable."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="collapse collapse-plus bg-gradient-to-r from-[#6AECE1]/10 to-[#26CCC2]/10 shadow-md hover:shadow-lg transition-all duration-300 border-2 border-[#6AECE1]/30"
              >
                <input type="radio" name="faq-accordion" />
                <div className="collapse-title text-lg font-semibold text-gray-800">
                  {faq.question}
                </div>
                <div className="collapse-content text-gray-600">
                  <p>{faq.answer}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
