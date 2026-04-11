import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { User } from '../../types';

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
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to load users');
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
      setActionMsg(err.response?.data?.error || err.response?.data?.message || 'Action failed');
    }
    setTimeout(() => setActionMsg(''), 3000);
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      await api.patch(`/admin/users/${userId}/disable`, { isActive: !isActive });
      setActionMsg(`User ${isActive ? 'disabled' : 'enabled'}`);
      loadUsers();
    } catch (err: any) {
      setActionMsg(err.response?.data?.error || err.response?.data?.message || 'Action failed');
    }
    setTimeout(() => setActionMsg(''), 3000);
  };

  const roleColors: Record<string, string> = {
    patient: '#34a853',
    doctor: '#1a73e8',
    student: '#9c27b0',
    admin: '#c62828',
  };
  const safeUsers = Array.isArray(users) ? users : [];

  return (
    <div>
      <h2 style={{ margin: '0 0 20px', fontSize: 22 }}>User Management</h2>

      {actionMsg && (
        <div
          style={{
            background: '#e8f5e9',
            color: '#2e7d32',
            padding: '8px 14px',
            borderRadius: 6,
            marginBottom: 14,
            fontSize: 13,
          }}
        >
          ✅ {actionMsg}
        </div>
      )}

      {loading && <p style={{ color: '#666' }}>Loading users…</p>}
      {error && (
        <div style={{ background: '#fce8e6', color: '#c5221f', padding: '10px 14px', borderRadius: 6 }}>
          {error}
        </div>
      )}

      <div
        style={{
          background: '#fff',
          border: '1px solid #e0e0e0',
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #e0e0e0' }}>
              {['Username', 'Email', 'Role', 'Verified', 'Active', 'Joined', 'Actions'].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: '12px 14px',
                    textAlign: 'left',
                    fontWeight: 600,
                    color: '#555',
                    fontSize: 12,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeUsers.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600 }}>{u.username}</td>
                <td style={{ padding: '10px 14px', color: '#555' }}>{u.email}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span
                    style={{
                      background: `${roleColors[u.role] || '#666'}20`,
                      color: roleColors[u.role] || '#666',
                      padding: '2px 8px',
                      borderRadius: 10,
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {u.role}
                  </span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ color: u.isVerified ? '#34a853' : '#e65100', fontWeight: 600, fontSize: 12 }}>
                    {u.isVerified ? '✅ Yes' : '⏳ No'}
                  </span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ color: u.isActive ? '#34a853' : '#ea4335', fontWeight: 600, fontSize: 12 }}>
                    {u.isActive ? '✅ Yes' : '❌ No'}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', color: '#666', whiteSpace: 'nowrap' }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {!u.isVerified && (
                      <button
                        onClick={() => handleVerify(u.id)}
                        style={{
                          padding: '4px 10px',
                          background: '#34a853',
                          color: '#fff',
                          border: 'none',
                          borderRadius: 4,
                          cursor: 'pointer',
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        Verify
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleActive(u.id, u.isActive)}
                      style={{
                        padding: '4px 10px',
                        background: u.isActive ? '#ea4335' : '#34a853',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 4,
                        cursor: 'pointer',
                        fontSize: 11,
                        fontWeight: 600,
                      }}
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
          <p style={{ padding: 20, color: '#666', textAlign: 'center' }}>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
