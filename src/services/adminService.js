import { API_CONFIG } from '../config/apiConfig';

class AdminService {
  async getAllUsers() {
    if (API_CONFIG.USE_API) {
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/admin/users/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch users');
      }

      const data = await response.json();
      return data.users;
    } else {
      // localStorage fallback - return mock admin data
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (!currentUser.is_admin) {
        throw new Error('Admin access required');
      }
      
      // Return mock users for demo
      return [
        {
          id: 1,
          username: 'admin',
          email: 'admin@example.com',
          first_name: 'Admin',
          last_name: 'User',
          province: 'Bagmati',
          is_admin: true,
          is_active: true,
          date_joined: new Date().toISOString()
        }
      ];
    }
  }

  async deleteUser(userId) {
    if (API_CONFIG.USE_API) {
      const response = await fetch(`${API_CONFIG.API_BASE_URL}/admin/users/${userId}/delete/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      return await response.json();
    } else {
      // localStorage fallback
      const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (!currentUser.is_admin) {
        throw new Error('Admin access required');
      }
      
      // Mock deletion for demo
      return { success: true, message: 'User deleted successfully' };
    }
  }
}

export const adminService = new AdminService();