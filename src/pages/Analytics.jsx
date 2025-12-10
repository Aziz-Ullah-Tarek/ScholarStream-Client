import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { 
  FiUsers, FiDollarSign, FiAward, FiTrendingUp,
  FiBarChart2, FiPieChart 
} from 'react-icons/fi';
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Analytics = () => {
  const { user, userRole } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalScholarships: 0,
    totalApplications: 0,
    totalFeesCollected: 0,
    usersByRole: { student: 0, moderator: 0, admin: 0 },
  });
  const [scholarships, setScholarships] = useState([]);

  useEffect(() => {
    if (userRole !== 'admin') {
      toast.error('Access denied. Admin only.');
      return;
    }
    fetchAnalyticsData();
  }, [userRole]);

  const fetchAnalyticsData = async () => {
    try {
      const token = await user.getIdToken();
      
      // Fetch users stats
      const usersStatsResponse = await axios.get(
        'http://localhost:5000/api/users/stats/summary',
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Fetch all scholarships
      const scholarshipsResponse = await axios.get('http://localhost:5000/api/scholarships');
      
      // Fetch all applications (if endpoint exists)
      let totalApplications = 0;
      let totalFeesCollected = 0;
      try {
        const applicationsResponse = await axios.get('http://localhost:5000/api/applications');
        totalApplications = applicationsResponse.data.length;
        totalFeesCollected = applicationsResponse.data.reduce(
          (sum, app) => sum + (app.totalFees || 0), 0
        );
      } catch (error) {
        console.log('Applications endpoint not available yet');
      }

      setStats({
        totalUsers: usersStatsResponse.data.total,
        totalScholarships: scholarshipsResponse.data.length,
        totalApplications,
        totalFeesCollected,
        usersByRole: usersStatsResponse.data.byRole,
      });

      setScholarships(scholarshipsResponse.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for charts
  const userRoleData = [
    { name: 'Students', value: stats.usersByRole.student || 0, color: '#10b981' },
    { name: 'Moderators', value: stats.usersByRole.moderator || 0, color: '#3b82f6' },
    { name: 'Admins', value: stats.usersByRole.admin || 0, color: '#ef4444' },
  ];

  const scholarshipCategoryData = scholarships.reduce((acc, scholarship) => {
    const category = scholarship.scholarshipCategory;
    const existing = acc.find(item => item.name === category);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: category, value: 1 });
    }
    return acc;
  }, []);

  const topUniversitiesData = scholarships
    .reduce((acc, scholarship) => {
      const uni = scholarship.universityName;
      const existing = acc.find(item => item.name === uni);
      if (existing) {
        existing.applications++;
      } else {
        acc.push({ name: uni, applications: 1 });
      }
      return acc;
    }, [])
    .sort((a, b) => b.applications - a.applications)
    .slice(0, 10);

  const degreeTypeData = scholarships.reduce((acc, scholarship) => {
    const degree = scholarship.degree;
    const existing = acc.find(item => item.name === degree);
    if (existing) {
      existing.value++;
    } else {
      acc.push({ name: degree, value: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#8B5CF6', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="loading loading-spinner loading-lg text-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
        <div className="flex items-center gap-3">
          <FiBarChart2 className="text-4xl text-purple-600" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">Platform statistics and insights</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Users Card */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Total Users</p>
              <h3 className="text-4xl font-bold mt-2">{stats.totalUsers}</h3>
              <p className="text-purple-200 text-xs mt-2">Registered on platform</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <FiUsers size={32} />
            </div>
          </div>
        </div>

        {/* Total Scholarships Card */}
        <div className="bg-gradient-to-br from-pink-500 to-pink-700 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-pink-100 text-sm font-medium">Total Scholarships</p>
              <h3 className="text-4xl font-bold mt-2">{stats.totalScholarships}</h3>
              <p className="text-pink-200 text-xs mt-2">Available opportunities</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <FiAward size={32} />
            </div>
          </div>
        </div>

        {/* Total Applications Card */}
        <div className="bg-gradient-to-br from-violet-500 to-violet-700 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-sm font-medium">Total Applications</p>
              <h3 className="text-4xl font-bold mt-2">{stats.totalApplications}</h3>
              <p className="text-violet-200 text-xs mt-2">Submitted by students</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <FiTrendingUp size={32} />
            </div>
          </div>
        </div>

        {/* Total Fees Collected Card */}
        <div className="bg-gradient-to-br from-amber-500 to-amber-700 rounded-2xl shadow-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium">Fees Collected</p>
              <h3 className="text-4xl font-bold mt-2">${stats.totalFeesCollected.toLocaleString()}</h3>
              <p className="text-amber-200 text-xs mt-2">Total revenue</p>
            </div>
            <div className="bg-white/20 p-4 rounded-full">
              <FiDollarSign size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Roles Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <FiPieChart className="text-2xl text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">Users by Role</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userRoleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {userRoleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Scholarship Categories Pie Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <FiPieChart className="text-2xl text-pink-600" />
            <h3 className="text-xl font-bold text-gray-800">Scholarship Categories</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={scholarshipCategoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {scholarshipCategoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bar Charts Section */}
      <div className="grid grid-cols-1 gap-6">
        {/* Top Universities Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <FiBarChart2 className="text-2xl text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">Top Universities by Scholarships</h3>
          </div>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={topUniversitiesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={120} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill="#8B5CF6" name="Number of Scholarships" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Degree Types Bar Chart */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-purple-200">
          <div className="flex items-center gap-2 mb-4">
            <FiBarChart2 className="text-2xl text-pink-600" />
            <h3 className="text-xl font-bold text-gray-800">Scholarships by Degree Type</h3>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={degreeTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#EC4899" name="Number of Scholarships" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
          <h4 className="font-bold text-gray-800 mb-2">Students</h4>
          <p className="text-3xl font-bold text-purple-600">{stats.usersByRole.student || 0}</p>
          <p className="text-sm text-gray-600 mt-1">Registered students</p>
        </div>

        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-200">
          <h4 className="font-bold text-gray-800 mb-2">Moderators</h4>
          <p className="text-3xl font-bold text-blue-600">{stats.usersByRole.moderator || 0}</p>
          <p className="text-sm text-gray-600 mt-1">Active moderators</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 border-2 border-red-200">
          <h4 className="font-bold text-gray-800 mb-2">Admins</h4>
          <p className="text-3xl font-bold text-red-600">{stats.usersByRole.admin || 0}</p>
          <p className="text-sm text-gray-600 mt-1">System administrators</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
