import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiSave, FiX, FiBook, FiGlobe, FiDollarSign, FiSettings } from 'react-icons/fi';
import API_URL from '../config/api';

const AddScholarship = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    scholarshipName: '',
    universityName: '',
    universityImage: '',
    universityCountry: '',
    universityCity: '',
    universityWorldRank: '',
    subjectCategory: '',
    scholarshipCategory: 'Full fund',
    degree: 'Bachelor',
    tuitionFees: '',
    applicationFees: '',
    serviceCharge: '',
    applicationDeadline: '',
    scholarshipPostDate: new Date().toISOString().split('T')[0],
    postedUserEmail: user?.email || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      scholarshipName: '',
      universityName: '',
      universityImage: '',
      universityCountry: '',
      universityCity: '',
      universityWorldRank: '',
      subjectCategory: '',
      scholarshipCategory: 'Full fund',
      degree: 'Bachelor',
      tuitionFees: '',
      applicationFees: '',
      serviceCharge: '',
      applicationDeadline: '',
      scholarshipPostDate: new Date().toISOString().split('T')[0],
      postedUserEmail: user?.email || '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = await user.getIdToken();
      // Convert numeric fields
      const scholarshipData = {
        ...formData,
        universityWorldRank: parseInt(formData.universityWorldRank),
        tuitionFees: formData.tuitionFees ? parseFloat(formData.tuitionFees) : undefined,
        applicationFees: parseFloat(formData.applicationFees),
        serviceCharge: parseFloat(formData.serviceCharge),
      };

      const response = await axios.post(`${API_URL}/api/scholarships`, scholarshipData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data) {
        toast.success('Scholarship added successfully! 🎉');
        handleReset();
      }
    } catch (error) {
      console.error('Error adding scholarship:', error);
      toast.error(error.response?.data?.message || 'Failed to add scholarship');
    } finally {
      setLoading(false);
    }
  };

  const subjectCategories = [
    'Computer Science',
    'Engineering',
    'Business Studies',
    'Medicine',
    'Data Science',
    'Artificial Intelligence',
    'Environmental Science',
    'Mechanical Engineering',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Economics',
    'Law',
    'Psychology',
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#26CCC2] via-[#6AECE1] to-[#6AECE1] rounded-2xl shadow-lg p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
              <FiBook className="text-3xl text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white drop-shadow-lg">
                Add New Scholarship
              </h1>
              <p className="text-white/90 mt-1">Create amazing opportunities for students worldwide</p>
            </div>
          </div>
        </div>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -mr-24 -mt-24"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-16 -mb-16"></div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="space-y-0">
          {/* Scholarship Information */}
          <div className="p-8 space-y-6 border-b-2 border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] rounded-lg">
                <FiBook className="text-xl text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] bg-clip-text text-transparent">
                Scholarship Information
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">Scholarship Name *</span>
                </label>
                <input
                  type="text"
                  name="scholarshipName"
                  value={formData.scholarshipName}
                  onChange={handleChange}
                  className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                  placeholder="write scholarship name here"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">Subject Category *</span>
                </label>
                <select
                  name="subjectCategory"
                  value={formData.subjectCategory}
                  onChange={handleChange}
                  className="select select-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                  required
                >
                  <option value="">Select Subject</option>
                  {subjectCategories.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">Scholarship Category *</span>
                </label>
                <select
                  name="scholarshipCategory"
                  value={formData.scholarshipCategory}
                  onChange={handleChange}
                  className="select select-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                  required
                >
                  <option value="Full fund">💎 Full fund</option>
                  <option value="Partial">⭐ Partial</option>
                  <option value="Self-fund">📚 Self-fund</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">Degree Level *</span>
                </label>
                <select
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  className="select select-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                  required
                >
                  <option value="Diploma">📜 Diploma</option>
                  <option value="Bachelor">📖 Bachelor</option>
                  <option value="Masters">🎓 Masters</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">Application Deadline *</span>
                </label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          {/* University Information */}
          <div className="p-8 space-y-6 border-b-2 border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] rounded-lg">
                <FiGlobe className="text-xl text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] bg-clip-text text-transparent">
                University Information
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">University Name *</span>
                </label>
                <input
                  type="text"
                  name="universityName"
                  value={formData.universityName}
                  onChange={handleChange}
                  className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                  placeholder="write university name"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">University Image URL *</span>
                </label>
                <input
                  type="url"
                  name="universityImage"
                  value={formData.universityImage}
                  onChange={handleChange}
                  className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                  placeholder="give image url"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">Country *</span>
                </label>
                <input
                  type="text"
                  name="universityCountry"
                  value={formData.universityCountry}
                  onChange={handleChange}
                  className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                  placeholder="university country"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">City *</span>
                </label>
                <input
                  type="text"
                  name="universityCity"
                  value={formData.universityCity}
                  onChange={handleChange}
                  className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                  placeholder="university city"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">World Rank *</span>
                </label>
                <input
                  type="number"
                  name="universityWorldRank"
                  value={formData.universityWorldRank}
                  onChange={handleChange}
                  className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                  placeholder="university world rank"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Financial Information */}
          <div className="p-8 space-y-6 border-b-2 border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] rounded-lg">
                <FiDollarSign className="text-xl text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] bg-clip-text text-transparent">
                Financial Information
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">Tuition Fees (USD)</span>
                  <span className="label-text-alt text-[#26CCC2] font-semibold">Optional</span>
                </label>
                <input
                  type="number"
                  name="tuitionFees"
                  value={formData.tuitionFees}
                  onChange={handleChange}
                  className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                  placeholder="e.g., 55000"
                  min="0"
                  step="0.01"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">Application Fees (USD) *</span>
                </label>
                <input
                  type="number"
                  name="applicationFees"
                  value={formData.applicationFees}
                  onChange={handleChange}
                  className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                  placeholder="e.g., 150"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">Service Charge (USD) *</span>
                </label>
                <input
                  type="number"
                  name="serviceCharge"
                  value={formData.serviceCharge}
                  onChange={handleChange}
                  className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                  placeholder="e.g., 50"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>
          </div>

          {/* System Information */}
          <div className="p-8 space-y-6 bg-gray-50">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-[#26CCC2] to-[#6AECE1] rounded-lg">
                <FiSettings className="text-xl text-white" />
              </div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] bg-clip-text text-transparent">
                System Information
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">Post Date</span>
                </label>
                <input
                  type="date"
                  name="scholarshipPostDate"
                  value={formData.scholarshipPostDate}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-gray-200 border-gray-300 cursor-not-allowed rounded-lg"
                  readOnly
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold text-gray-700">Posted By</span>
                </label>
                <input
                  type="email"
                  name="postedUserEmail"
                  value={formData.postedUserEmail}
                  className="input input-bordered w-full bg-gray-200 border-gray-300 cursor-not-allowed rounded-lg"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-8 bg-white">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-lg flex-1 bg-gradient-to-r from-[#26CCC2] to-[#6AECE1] hover:from-purple-700 hover:to-pink-700 text-white border-none shadow-lg hover:shadow-xl transition-all font-bold rounded-lg"
              >
                {loading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Creating Scholarship...
                  </>
                ) : (
                  <>
                    <FiSave size={20} />
                    Add Scholarship
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="btn btn-lg btn-outline border-2 border-gray-300 hover:bg-gray-100 font-bold rounded-lg"
              >
                <FiX size={20} />
                Reset Form
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddScholarship;

