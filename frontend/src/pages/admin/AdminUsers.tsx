import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { User } from '../../types';

const roleClass: Record<string, string> = {
  patient: 'bg-success-100 text-success-700',
  doctor: 'bg-primary-50 text-primary-600',
  student: 'bg-purple-100 text-purple-700',
  admin: 'bg-danger-100 text-danger-700',
};

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data.data?.users ?? []);
    } catch (err: any) {
      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Failed to load users',
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleVerify = async (userId: string) => {
    try {
      await api.patch(`/admin/users/${userId}/verify`, { isVerified: true });
      setActionMsg('User verified');
      loadUsers();
    } catch (err: any) {
      setActionMsg(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Action failed',
      );
    }
    setTimeout(() => setActionMsg(''), 3000);
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}/disable`, { isActive: !isActive });
      setActionMsg(`User ${isActive ? 'disabled' : 'enabled'}`);
      loadUsers();
    } catch (err: any) {
      setActionMsg(
        err.response?.data?.error ||
          err.response?.data?.message ||
          'Action failed',
      );
    }
    setTimeout(() => setActionMsg(''), 3000);
  };

  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <div>
      <h2 className="mb-5 text-2xl font-bold text-gray-800">User Management</h2>

      {actionMsg && (
        <div className="mb-3.5 rounded-lg bg-success-100 px-4 py-2 text-sm text-success-700">
          ✅ {actionMsg}
        </div>
      )}

      {loading && <p className="text-gray-500">Loading users…</p>}
      {error && (
        <div className="mb-4 rounded-lg bg-danger-100 px-4 py-3 text-danger-700">
          {error}
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-gray-200 bg-gray-50">
              {[
                'Username',
                'Email',
                'Role',
                'Verified',
                'Active',
                'Joined',
                'Actions',
              ].map((h) => (
                <th
                  key={h}
                  className="whitespace-nowrap px-3.5 py-3 text-left text-xs font-semibold text-gray-500"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeUsers.map((u) => (
              <tr key={u.id} className="border-b border-gray-100">
                <td className="px-3.5 py-2.5 font-semibold text-gray-800">
                  {u.username}
                </td>
                <td className="px-3.5 py-2.5 text-gray-500">{u.email}</td>
                <td className="px-3.5 py-2.5">
                  <span
                    className={`badge ${roleClass[u.role] ?? 'bg-gray-100 text-gray-600'}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-3.5 py-2.5">
                  <span
                    className={`text-xs font-semibold ${u.isVerified ? 'text-success-500' : 'text-orange-600'}`}
                  >
                    {u.isVerified ? '✅ Yes' : '⏳ No'}
                  </span>
                </td>
                <td className="px-3.5 py-2.5">
                  <span
                    className={`text-xs font-semibold ${u.isActive ? 'text-success-500' : 'text-danger-500'}`}
                  >
                    {u.isActive ? '✅ Yes' : '❌ No'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-3.5 py-2.5 text-gray-500">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-3.5 py-2.5">
                  <div className="flex gap-1.5">
                    {!u.isVerified && (
                      <button
                        onClick={() => handleVerify(u.id)}
                        className="btn-sm rounded-md bg-success-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-success-700"
                      >
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleActive(u.id, u.isActive)}
                      className={`btn-sm rounded-md px-2.5 py-1 text-xs font-semibold text-white ${u.isActive ? 'bg-danger-500 hover:bg-danger-700' : 'bg-success-500 hover:bg-success-700'}`}
                    >
                      {u.isActive ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && safeUsers.length === 0 && (
          <p className="p-5 text-center text-gray-500">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
