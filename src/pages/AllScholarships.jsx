import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaGraduationCap, FaDollarSign, FaCalendarAlt, FaTimes } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

const AllScholarships = () => {
  const [scholarships, setScholarships] = useState([]);
  const [filteredScholarships, setFilteredScholarships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDegree, setSelectedDegree] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');

  // Dynamic filter options
  const [categories, setCategories] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [degrees, setDegrees] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchScholarships();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, selectedSubject, selectedDegree, selectedCountry, scholarships]);

  const fetchScholarships = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/scholarships');
      setScholarships(response.data);
      extractFilterOptions(response.data);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractFilterOptions = (data) => {
    // Extract unique values for filters
    const uniqueCategories = [...new Set(data.map(s => s.scholarshipCategory))].filter(Boolean);
    const uniqueSubjects = [...new Set(data.map(s => s.subjectCategory))].filter(Boolean);
    const uniqueDegrees = [...new Set(data.map(s => s.degree))].filter(Boolean);
    const uniqueCountries = [...new Set(data.map(s => s.universityCountry))].filter(Boolean);

    setCategories(uniqueCategories);
    setSubjects(uniqueSubjects);
    setDegrees(uniqueDegrees);
    setCountries(uniqueCountries);
  };

  const applyFilters = () => {
    let filtered = [...scholarships];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(scholarship =>
        scholarship.scholarshipName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.universityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.degree?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter(s => s.scholarshipCategory === selectedCategory);
    }

    // Subject filter
    if (selectedSubject) {
      filtered = filtered.filter(s => s.subjectCategory === selectedSubject);
    }

    // Degree filter
    if (selectedDegree) {
      filtered = filtered.filter(s => s.degree === selectedDegree);
    }

    // Country filter
    if (selectedCountry) {
      filtered = filtered.filter(s => s.universityCountry === selectedCountry);
    }

    setFilteredScholarships(filtered);
  };

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedSubject('');
    setSelectedDegree('');
    setSelectedCountry('');
  };

  const activeFiltersCount = [selectedCategory, selectedSubject, selectedDegree, selectedCountry].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6AECE1]/10 via-white to-[#6AECE1]/5">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-[#26CCC2] via-[#6AECE1] to-[#FFB76C] text-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center mb-4"
          >
            Explore All Scholarships
          </motion.h1>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-center text-[#6AECE1]/20"
          >
            Find your perfect scholarship opportunity from {scholarships.length} available programs
          </motion.p>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Loading State */}
        {loading ? (
          <LoadingSpinner message="Loading scholarships..." />
        ) : (
          <>
        {/* Search and Filter Bar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-white rounded-2xl shadow-xl p-6 mb-8"
        >
          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by scholarship name, university, or degree..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-12 pr-4 h-12 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#26CCC2] border-2 border-gray-200 hover:border-[#6AECE1] transition-all duration-300"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn h-12 px-6 rounded-xl font-semibold transition-all duration-300 ${
                showFilters ? 'bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] text-white border-0 shadow-lg' : 'btn-outline border-2 border-[#26CCC2] text-[#26CCC2] hover:bg-gradient-to-r hover:from-[#26CCC2] hover:to-[#FFB76C] hover:text-white hover:border-0'
              }`}
            >
              <FaFilter className="mr-2" />
              Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
            </button>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="border-t pt-4 mt-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Scholarship Category */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700">Scholarship Category</span>
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="select select-bordered w-full rounded-lg"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Subject Category */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700">Subject Category</span>
                  </label>
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="select select-bordered w-full rounded-lg"
                  >
                    <option value="">All Subjects</option>
                    {subjects.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                {/* Degree */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700">Degree Level</span>
                  </label>
                  <select
                    value={selectedDegree}
                    onChange={(e) => setSelectedDegree(e.target.value)}
                    className="select select-bordered w-full rounded-lg"
                  >
                    <option value="">All Degrees</option>
                    {degrees.map(deg => (
                      <option key={deg} value={deg}>{deg}</option>
                    ))}
                  </select>
                </div>

                {/* Country */}
                <div>
                  <label className="label">
                    <span className="label-text font-semibold text-gray-700">Country</span>
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="select select-bordered w-full rounded-lg"
                  >
                    <option value="">All Countries</option>
                    {countries.map(country => (
                      <option key={country} value={country}>{country}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear Filters Button */}
              {activeFiltersCount > 0 && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={clearAllFilters}
                    className="btn btn-ghost btn-sm text-red-500 hover:text-red-600"
                  >
                    <FaTimes className="mr-1" />
                    Clear All Filters
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Results Count */}
          <div className="mt-4 text-center text-gray-600">
            Showing <span className="font-bold bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] bg-clip-text text-transparent">{filteredScholarships.length}</span> of{' '}
            <span className="font-bold">{scholarships.length}</span> scholarships
          </div>
        </motion.div>

        {/* Scholarships Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <span className="loading loading-spinner loading-lg text-blue-500"></span>
          </div>
        ) : filteredScholarships.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No Scholarships Found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
            <button onClick={clearAllFilters} className="btn bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] hover:from-[#26CCC2] hover:to-[#FFB76C] text-white border-0 shadow-lg">
              Clear Filters
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredScholarships.map((scholarship, index) => (
              <motion.div
                key={scholarship._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="card bg-white shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-[#6AECE1]/20 hover:border-[#6AECE1] rounded-2xl overflow-hidden"
              >
                {/* Image */}
                <figure className="h-52 overflow-hidden relative">
                  <img
                    src={scholarship.universityImage}
                    alt={scholarship.universityName}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#26CCC2]/30 to-transparent"></div>
                  <div className="absolute top-4 right-4">
                    <div className="badge bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] text-white border-0 badge-lg shadow-lg font-semibold">
                      {scholarship.scholarshipCategory}
                    </div>
                  </div>
                </figure>

                {/* Content */}
                <div className="card-body p-6">
                  {/* University Name */}
                  <div className="flex items-center gap-2 mb-2">
                    <FaGraduationCap className="text-purple-500 text-lg" />
                    <h3 className="font-bold text-gray-800 text-sm">
                      {scholarship.universityName}
                    </h3>
                  </div>

                  {/* Scholarship Name */}
                  <h2 className="card-title text-xl mb-3 text-gray-900 line-clamp-2">
                    {scholarship.scholarshipName}
                  </h2>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <FaMapMarkerAlt className="text-pink-500" />
                    <span className="text-sm">
                      {scholarship.universityCity}, {scholarship.universityCountry}
                    </span>
                  </div>

                  {/* Degree Badge */}
                  <div className="mb-3">
                    <span className="badge badge-outline badge-lg">
                      {scholarship.degree}
                    </span>
                  </div>

                  <div className="divider my-2"></div>

                  {/* Fees and Deadline */}
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <FaDollarSign className="text-green-500" />
                        Application Fee
                      </span>
                      <span className="font-bold text-green-600">
                        ${scholarship.applicationFees}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center gap-1">
                        <FaCalendarAlt className="text-orange-500" />
                        Deadline
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        {new Date(scholarship.applicationDeadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Link
                    to={`/scholarship/${scholarship._id}`}
                    className="btn bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] hover:from-[#26CCC2] hover:to-[#FFB76C] text-white border-0 w-full rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    View Details
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        </>
        )}
      </div>
    </div>
  );
};

export default AllScholarships;


