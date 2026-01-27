import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { adminService } from '../services/adminService';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import SuccessMessage from '../components/common/SuccessMessage';
import Button from '../components/common/Button';
import ConfirmModal from '../components/common/ConfirmModal';

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [deleteModal, setDeleteModal] = useState({ open: false, user: null });
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const usersData = await adminService.getAllUsers();
      setUsers(usersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (userToDelete) => {
    setDeleteModal({ open: true, user: userToDelete });
  };

  const confirmDelete = async () => {
    if (!deleteModal.user) return;

    try {
      setDeleting(true);
      setError('');
      await adminService.deleteUser(deleteModal.user.id);
      setSuccess(`User ${deleteModal.user.username} deleted successfully`);
      setUsers(users.filter(u => u.id !== deleteModal.user.id));
      setDeleteModal({ open: false, user: null });
    } catch (err) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const cancelDelete = () => {
    setDeleteModal({ open: false, user: null });
  };

  // Check if user is admin
  if (!user?.is_admin && !user?.is_superuser) {
    return (
      <>
        <Navbar />
        <div style={{ padding: '100px 20px', textAlign: 'center' }}>
          <h2>Access Denied</h2>
          <p>Admin access required to view this page.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <ConfirmModal
        isOpen={deleteModal.open}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        isSubmitting={deleting}
        confirmText="Delete User"
        cancelText="Cancel"
        title="Confirm User Deletion"
        message="This action cannot be undone. The user and all their data will be permanently deleted."
      >
        {deleteModal.user && (
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
            <strong>User to delete:</strong><br />
            {deleteModal.user.username} ({deleteModal.user.email})
          </div>
        )}
      </ConfirmModal>

      <div style={{ padding: '100px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1>Admin Panel - User Management</h1>
          <p>Manage system users and their permissions</p>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && <SuccessMessage message={success} />}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <LoadingSpinner size="lg" />
            <div>Loading users...</div>
          </div>
        ) : (
          <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #e0e0e0', backgroundColor: '#f8f9fa' }}>
              <h3 style={{ margin: 0 }}>All Users ({users.length})</h3>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8f9fa' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Username</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Name</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Province</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Role</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid #e0e0e0' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(userItem => (
                    <tr key={userItem.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px' }}>{userItem.username}</td>
                      <td style={{ padding: '12px' }}>{userItem.email}</td>
                      <td style={{ padding: '12px' }}>{userItem.first_name} {userItem.last_name}</td>
                      <td style={{ padding: '12px' }}>{userItem.province || 'N/A'}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '12px',
                          backgroundColor: userItem.is_admin ? '#dc3545' : '#6c757d',
                          color: 'white'
                        }}>
                          {userItem.is_admin ? 'Admin' : 'User'}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '12px',
                          backgroundColor: userItem.is_active ? '#28a745' : '#6c757d',
                          color: 'white'
                        }}>
                          {userItem.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td style={{ padding: '12px' }}>
                        {userItem.id !== user.id && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeleteUser(userItem)}
                            disabled={deleting}
                          >
                            Delete
                          </Button>
                        )}
                        {userItem.id === user.id && (
                          <span style={{ color: '#6c757d', fontSize: '12px' }}>Current User</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {users.length === 0 && (
              <div style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>
                No users found
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanel;