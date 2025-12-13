import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiSearch, FiTrash2, FiShield } from 'react-icons/fi';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';

const ManageUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [roleUpdateLoading, setRoleUpdateLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await user.getIdToken();
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (email, newRole) => {
    setRoleUpdateLoading(email);
    try {
      const token = await user.getIdToken();
      await axios.patch(
        `${API_URL}/api/users/${email}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(`User role updated to ${newRole}`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error(error.response?.data?.message || 'Failed to update user role');
    } finally {
      setRoleUpdateLoading(null);
    }
  };

  const handleDelete = async (email) => {
    if (email === user?.email) {
      toast.error('You cannot delete your own account');
      return;
    }

    setDeleteLoading(email);
    try {
      const token = await user.getIdToken();
      await axios.delete(`${API_URL}/api/users/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === '' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'badge-error';
      case 'moderator':
        return 'badge-info';
      default:
        return 'badge-success';
    }
  };

  const getRoleStats = () => {
    return {
      total: users.length,
      students: users.filter((u) => u.role === 'student').length,
      moderators: users.filter((u) => u.role === 'moderator').length,
      admins: users.filter((u) => u.role === 'admin').length,
    };
  };

  const stats = getRoleStats();

  if (loading) {
    return <LoadingSpinner message="Loading users..." fullScreen />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#6AECE1]/20">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] bg-clip-text text-transparent">
          Manage Users
        </h1>
        <p className="text-gray-600 mt-2">Manage user roles and permissions</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#26CCC2] to-[#26CCC2] rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90">Total Users</p>
          <p className="text-4xl font-bold mt-2">{stats.total}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90">Students</p>
          <p className="text-4xl font-bold mt-2">{stats.students}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90">Moderators</p>
          <p className="text-4xl font-bold mt-2">{stats.moderators}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-sm opacity-90">Admins</p>
          <p className="text-4xl font-bold mt-2">{stats.admins}</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-[#6AECE1]/20">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered w-full pl-12 border-2 border-[#6AECE1]/20 focus:border-[#26CCC2] focus:outline-none"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="select select-bordered border-2 border-[#6AECE1]/20 focus:border-[#26CCC2] focus:outline-none"
          >
            <option value="">All Roles</option>
            <option value="student">Students</option>
            <option value="moderator">Moderators</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-xl border-2 border-[#6AECE1]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-gradient-to-r from-[#26CCC2] to-[#FFB76C] text-white">
              <tr>
                <th className="text-white">#</th>
                <th className="text-white">User</th>
                <th className="text-white">Email</th>
                <th className="text-white">Current Role</th>
                <th className="text-white">Change Role</th>
                <th className="text-white text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-8 text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u, index) => (
                  <tr key={u._id} className="hover:bg-[#6AECE1]/10">
                    <td className="font-semibold">{index + 1}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <img
                          src={u.photoURL || 'https://via.placeholder.com/40'}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold">{u.name || 'Anonymous'}</p>
                          <p className="text-xs text-gray-500">
                            Joined {new Date(u.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="font-medium">{u.email}</td>
                    <td>
                      <span className={`badge ${getRoleBadgeColor(u.role)} uppercase font-semibold`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.email, e.target.value)}
                        disabled={roleUpdateLoading === u.email || u.email === user?.email}
                        className="select select-sm select-bordered border-[#6AECE1] focus:border-[#26CCC2]"
                      >
                        <option value="student">Student</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                      {roleUpdateLoading === u.email && (
                        <span className="loading loading-spinner loading-xs ml-2 text-[#26CCC2]"></span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleDelete(u.email)}
                          disabled={deleteLoading === u.email || u.email === user?.email}
                          className="btn btn-sm bg-red-500 hover:bg-red-600 text-white border-none disabled:bg-gray-400"
                          title={u.email === user?.email ? 'Cannot delete own account' : 'Delete user'}
                        >
                          {deleteLoading === u.email ? (
                            <span className="loading loading-spinner loading-xs"></span>
                          ) : (
                            <FiTrash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Information */}
      <div className="bg-gradient-to-r from-[#6AECE1]/10 to-[#FFF57E]/10 rounded-2xl p-6 border-2 border-[#6AECE1]/20">
        <div className="flex items-center gap-3 mb-4">
          <FiShield size={24} className="text-[#26CCC2]" />
          <h3 className="text-xl font-bold text-gray-800">Role Descriptions</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border-2 border-green-200">
            <h4 className="font-bold text-green-600 mb-2">Student</h4>
            <p className="text-sm text-gray-600">
              Can browse scholarships, view details, and apply for opportunities.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-blue-200">
            <h4 className="font-bold text-blue-600 mb-2">Moderator</h4>
            <p className="text-sm text-gray-600">
              Can review applications, provide feedback, and update application status.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 border-2 border-red-200">
            <h4 className="font-bold text-red-600 mb-2">Admin</h4>
            <p className="text-sm text-gray-600">
              Full access to manage users, scholarships, and view analytics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;

