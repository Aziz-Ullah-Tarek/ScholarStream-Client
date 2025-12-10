import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiSearch, FiX, FiGrid, FiList, FiGlobe, FiCalendar, FiDollarSign, FiAward, FiBook, FiMapPin, FiSave } from 'react-icons/fi';

const ManageScholarships = () => {
  const { user } = useAuth();
  const [scholarships, setScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [editingScholarship, setEditingScholarship] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({});
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    fetchScholarships();
  }, []);

  const fetchScholarships = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/scholarships');
      setScholarships(response.data);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      toast.error('Failed to load scholarships');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this scholarship?')) {
      return;
    }

    setDeleteLoading(id);
    try {
      await axios.delete(`http://localhost:5000/api/scholarships/${id}`);
      toast.success('Scholarship deleted successfully');
      fetchScholarships();
    } catch (error) {
      console.error('Error deleting scholarship:', error);
      toast.error('Failed to delete scholarship');
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleEditClick = (scholarship) => {
    setEditingScholarship(scholarship._id);
    setUpdateFormData({
      scholarshipName: scholarship.scholarshipName,
      universityName: scholarship.universityName,
      universityImage: scholarship.universityImage,
      universityCountry: scholarship.universityCountry,
      universityCity: scholarship.universityCity,
      universityWorldRank: scholarship.universityWorldRank,
      subjectCategory: scholarship.subjectCategory,
      scholarshipCategory: scholarship.scholarshipCategory,
      degree: scholarship.degree,
      tuitionFees: scholarship.tuitionFees || '',
      applicationFees: scholarship.applicationFees,
      serviceCharge: scholarship.serviceCharge,
      applicationDeadline: scholarship.applicationDeadline,
    });
  };

  const handleUpdate = async (id) => {
    try {
      const updatedData = {
        ...updateFormData,
        universityWorldRank: parseInt(updateFormData.universityWorldRank),
        tuitionFees: updateFormData.tuitionFees ? parseFloat(updateFormData.tuitionFees) : undefined,
        applicationFees: parseFloat(updateFormData.applicationFees),
        serviceCharge: parseFloat(updateFormData.serviceCharge),
      };

      await axios.put(`http://localhost:5000/api/scholarships/${id}`, updatedData);
      toast.success('Scholarship updated successfully');
      setEditingScholarship(null);
      fetchScholarships();
    } catch (error) {
      console.error('Error updating scholarship:', error);
      toast.error('Failed to update scholarship');
    }
  };

  const filteredScholarships = scholarships.filter((scholarship) =>
    scholarship.scholarshipName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.universityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    scholarship.subjectCategory.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subjectCategories = [
    'Computer Science',
    'Engineering',
    'Business Studies',
    'Medicine',
    'Data Science',
    'Artificial Intelligence',
    'Environmental Science',
    'Mechanical Engineering',
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg text-[#26CCC2]"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#26CCC2] via-[#FFB76C] to-[#6AECE1] rounded-3xl shadow-2xl p-8">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                <FiAward className="text-3xl text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                Manage Scholarships
              </h1>
            </div>
            <p className="text-[#6AECE1]/10 text-lg">Update or delete scholarship opportunities</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center">
            <p className="text-5xl font-bold text-white drop-shadow-lg">{scholarships.length}</p>
            <p className="text-sm text-[#6AECE1]/10 mt-1 font-semibold">Total Scholarships</p>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Search Bar and View Toggle */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#6AECE1]/20">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by scholarship name, university, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-lg w-full pl-12 bg-white border-2 border-[#6AECE1] focus:border-[#26CCC2] focus:ring-2 focus:ring-[#6AECE1]/20 rounded-xl transition-all"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`btn btn-lg ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] text-white border-none'
                  : 'btn-outline border-2 border-[#6AECE1]'
              } rounded-xl`}
            >
              <FiGrid size={20} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`btn btn-lg ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] text-white border-none'
                  : 'btn-outline border-2 border-[#6AECE1]'
              } rounded-xl`}
            >
              <FiList size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Scholarships Display */}
      {filteredScholarships.length === 0 ? (
        <div className="bg-white rounded-3xl shadow-xl p-16 text-center border-2 border-[#6AECE1]/20">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No Scholarships Found</h3>
          <p className="text-gray-600">Try adjusting your search terms</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredScholarships.map((scholarship, index) => (
            <div
              key={scholarship._id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl overflow-hidden border-2 border-[#6AECE1]/20 hover:border-[#26CCC2] transition-all duration-300"
            >
              {/* Card Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={scholarship.universityImage}
                  alt={scholarship.universityName}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-4 py-2 rounded-full font-bold text-white text-sm shadow-lg ${
                      scholarship.scholarshipCategory === 'Full fund'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                        : scholarship.scholarshipCategory === 'Partial'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600'
                        : 'bg-gradient-to-r from-blue-500 to-cyan-600'
                    }`}
                  >
                    {scholarship.scholarshipCategory}
                  </span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-bold text-lg line-clamp-1">
                    {scholarship.scholarshipName}
                  </h3>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                {/* University Info */}
                <div className="flex items-start gap-3">
                  <FiGlobe className="text-[#26CCC2] mt-1 flex-shrink-0" size={20} />
                  <div>
                    <p className="font-bold text-gray-800">{scholarship.universityName}</p>
                    <p className="text-sm text-gray-600">
                      {scholarship.universityCity}, {scholarship.universityCountry} • Rank #{scholarship.universityWorldRank}
                    </p>
                  </div>
                </div>

                {/* Subject and Degree */}
                <div className="flex flex-wrap gap-2">
                  <span className="badge badge-lg bg-[#6AECE1]/10 text-[#26CCC2] border-[#6AECE1] font-semibold">
                    {scholarship.subjectCategory}
                  </span>
                  <span className="badge badge-lg bg-[#FFF57E]/10 text-[#FFB76C] border-[#FFF57E] font-semibold">
                    {scholarship.degree}
                  </span>
                </div>

                {/* Financial Info */}
                <div className="flex items-center justify-between bg-gradient-to-r from-[#6AECE1]/10 to-[#FFF57E]/10 rounded-xl p-3">
                  <div className="flex items-center gap-2">
                    <FiDollarSign className="text-[#26CCC2]" size={18} />
                    <span className="text-sm font-semibold text-gray-700">Application Fee</span>
                  </div>
                  <span className="text-lg font-bold text-[#26CCC2]">
                    ${scholarship.applicationFees}
                  </span>
                </div>

                {/* Deadline */}
                <div className="flex items-center gap-2 text-sm">
                  <FiCalendar className="text-gray-500" size={16} />
                  <span className="text-gray-600">
                    Deadline: <span className="font-semibold">{new Date(scholarship.applicationDeadline).toLocaleDateString()}</span>
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleEditClick(scholarship)}
                    className="btn btn-sm flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-none rounded-xl"
                  >
                    <FiEdit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(scholarship._id)}
                    disabled={deleteLoading === scholarship._id}
                    className="btn btn-sm bg-gradient-to-r from-red-500 to-[#FFB76C] hover:from-red-600 hover:to-[#FFB76C] text-white border-none rounded-xl"
                  >
                    {deleteLoading === scholarship._id ? (
                      <span className="loading loading-spinner loading-xs"></span>
                    ) : (
                      <FiTrash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredScholarships.map((scholarship, index) => (
            <div
              key={scholarship._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl border-2 border-[#6AECE1]/20 hover:border-[#26CCC2] transition-all duration-300 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row">
                {/* Image */}
                <div className="md:w-48 h-48 md:h-auto">
                  <img
                    src={scholarship.universityImage}
                    alt={scholarship.universityName}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-3 flex-1">
                      {/* Title */}
                      <h3 className="text-2xl font-bold text-gray-800 line-clamp-1">
                        {scholarship.scholarshipName}
                      </h3>

                      {/* University */}
                      <div className="flex items-center gap-2">
                        <FiGlobe className="text-[#26CCC2]" size={18} />
                        <span className="font-semibold text-gray-700">
                          {scholarship.universityName}
                        </span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600 text-sm">
                          {scholarship.universityCity}, {scholarship.universityCountry}
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        <span className={`badge badge-lg font-semibold ${
                          scholarship.scholarshipCategory === 'Full fund'
                            ? 'bg-green-100 text-green-700 border-green-300'
                            : scholarship.scholarshipCategory === 'Partial'
                            ? 'bg-amber-100 text-amber-700 border-amber-300'
                            : 'bg-blue-100 text-blue-700 border-blue-300'
                        }`}>
                          {scholarship.scholarshipCategory}
                        </span>
                        <span className="badge badge-lg bg-[#6AECE1]/10 text-[#26CCC2] border-[#6AECE1] font-semibold">
                          {scholarship.subjectCategory}
                        </span>
                        <span className="badge badge-lg bg-[#FFF57E]/10 text-[#FFB76C] border-[#FFF57E] font-semibold">
                          {scholarship.degree}
                        </span>
                      </div>

                      {/* Financial & Deadline */}
                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <FiDollarSign className="text-[#26CCC2]" size={16} />
                          <span className="text-gray-600">
                            Fee: <span className="font-bold text-[#26CCC2]">${scholarship.applicationFees}</span>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FiCalendar className="text-gray-500" size={16} />
                          <span className="text-gray-600">
                            Deadline: <span className="font-semibold">{new Date(scholarship.applicationDeadline).toLocaleDateString()}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex md:flex-col gap-2">
                      <button
                        onClick={() => handleEditClick(scholarship)}
                        className="btn btn-sm md:btn-md bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-none rounded-xl"
                      >
                        <FiEdit2 size={18} />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(scholarship._id)}
                        disabled={deleteLoading === scholarship._id}
                        className="btn btn-sm md:btn-md bg-gradient-to-r from-red-500 to-[#FFB76C] hover:from-red-600 hover:to-[#FFB76C] text-white border-none rounded-xl"
                      >
                        {deleteLoading === scholarship._id ? (
                          <span className="loading loading-spinner loading-sm"></span>
                        ) : (
                          <>
                            <FiTrash2 size={18} />
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingScholarship && (
        <div className="modal modal-open">
          <div className="modal-box max-w-5xl max-h-[90vh] bg-white p-0 overflow-hidden">
            {/* Modal Header - Gradient Background */}
            <div className="sticky top-0 bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] px-8 py-6 z-10">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-2xl text-white flex items-center gap-3">
                  <FiEdit2 size={24} />
                  Update Scholarship
                </h3>
                <button
                  onClick={() => setEditingScholarship(null)}
                  className="btn btn-sm btn-circle bg-white/20 hover:bg-white/30 border-none text-white"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>

            {/* Modal Content - Scrollable */}
            <div className="px-8 py-6 max-h-[65vh] overflow-y-auto">
              <div className="space-y-6">
                {/* Scholarship Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-[#6AECE1]/10">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#26CCC2] to-[#FFB76C] flex items-center justify-center">
                      <FiBook className="text-white" size={20} />
                    </div>
                    <h4 className="font-bold text-lg text-gray-800">Scholarship Details</h4>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">Scholarship Name *</span>
                      </label>
                      <input
                        type="text"
                        value={updateFormData.scholarshipName}
                        onChange={(e) =>
                          setUpdateFormData({ ...updateFormData, scholarshipName: e.target.value })
                        }
                        className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                        placeholder="Enter scholarship name"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">Subject Category *</span>
                      </label>
                      <select
                        value={updateFormData.subjectCategory}
                        onChange={(e) =>
                          setUpdateFormData({ ...updateFormData, subjectCategory: e.target.value })
                        }
                        className="select select-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                      >
                        {subjectCategories.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">Scholarship Category *</span>
                      </label>
                      <select
                        value={updateFormData.scholarshipCategory}
                        onChange={(e) =>
                          setUpdateFormData({ ...updateFormData, scholarshipCategory: e.target.value })
                        }
                        className="select select-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
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
                        value={updateFormData.degree}
                        onChange={(e) =>
                          setUpdateFormData({ ...updateFormData, degree: e.target.value })
                        }
                        className="select select-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
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
                        value={updateFormData.applicationDeadline}
                        onChange={(e) =>
                          setUpdateFormData({ ...updateFormData, applicationDeadline: e.target.value })
                        }
                        className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* University Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-[#6AECE1]/10">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#26CCC2] to-[#FFB76C] flex items-center justify-center">
                      <FiMapPin className="text-white" size={20} />
                    </div>
                    <h4 className="font-bold text-lg text-gray-800">University Information</h4>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">University Name *</span>
                      </label>
                      <input
                        type="text"
                        value={updateFormData.universityName}
                        onChange={(e) =>
                          setUpdateFormData({ ...updateFormData, universityName: e.target.value })
                        }
                        className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                        placeholder="Enter university name"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">World Rank</span>
                      </label>
                      <input
                        type="number"
                        value={updateFormData.universityWorldRank}
                        onChange={(e) =>
                          setUpdateFormData({ ...updateFormData, universityWorldRank: e.target.value })
                        }
                        className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                        placeholder="e.g., 100"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">Country *</span>
                      </label>
                      <input
                        type="text"
                        value={updateFormData.universityCountry}
                        onChange={(e) =>
                          setUpdateFormData({ ...updateFormData, universityCountry: e.target.value })
                        }
                        className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                        placeholder="Enter country"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">City *</span>
                      </label>
                      <input
                        type="text"
                        value={updateFormData.universityCity}
                        onChange={(e) =>
                          setUpdateFormData({ ...updateFormData, universityCity: e.target.value })
                        }
                        className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                        placeholder="Enter city"
                      />
                    </div>
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold text-gray-700">University Image URL</span>
                    </label>
                    <input
                      type="url"
                      value={updateFormData.universityImage}
                      onChange={(e) =>
                        setUpdateFormData({ ...updateFormData, universityImage: e.target.value })
                      }
                      className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                {/* Financial Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b-2 border-[#6AECE1]/10">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#26CCC2] to-[#FFB76C] flex items-center justify-center">
                      <FiDollarSign className="text-white" size={20} />
                    </div>
                    <h4 className="font-bold text-lg text-gray-800">Financial Details</h4>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">Tuition Fees (USD) *</span>
                      </label>
                      <input
                        type="number"
                        value={updateFormData.tuitionFees}
                        onChange={(e) =>
                          setUpdateFormData({ ...updateFormData, tuitionFees: e.target.value })
                        }
                        className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                        placeholder="0"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">Application Fees (USD) *</span>
                      </label>
                      <input
                        type="number"
                        value={updateFormData.applicationFees}
                        onChange={(e) =>
                          setUpdateFormData({ ...updateFormData, applicationFees: e.target.value })
                        }
                        className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                        placeholder="0"
                      />
                    </div>

                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-semibold text-gray-700">Service Charge (USD) *</span>
                      </label>
                      <input
                        type="number"
                        value={updateFormData.serviceCharge}
                        onChange={(e) =>
                          setUpdateFormData({ ...updateFormData, serviceCharge: e.target.value })
                        }
                        className="input input-bordered w-full border-gray-300 focus:border-[#26CCC2] focus:outline-none focus:ring-2 focus:ring-[#6AECE1]/20 rounded-lg"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer - Sticky */}
            <div className="sticky bottom-0 bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditingScholarship(null)}
                className="btn btn-ghost border border-gray-300 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleUpdate(editingScholarship)}
                className="btn bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] text-white border-none hover:from-[#26CCC2] hover:to-[#FFB76C] rounded-lg"
              >
                <FiSave size={18} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageScholarships;

