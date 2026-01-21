/**
 * Notification Service
 * Handles user notifications and alerts
 * Ready for backend API integration
 */

import { notificationAPI } from './api';
import { getToken } from '../utils/authUtils';

/**
 * Notification Service
 * Manages user notifications
 */
class NotificationService {
  /**
   * Get all notifications for current user
   * @returns {Array} - Array of notifications
   */
  async getNotifications() {
    try {
      const notifications = await notificationAPI.getNotifications();
      return notifications || [];
    } catch (error) {
      console.error('Get notifications API error:', error);
      return [];
    }
  }

  /**
   * Get unread notification count
   * @returns {number} - Count of unread notifications
   */
  async getUnreadCount() {
    try {
      const notifications = await this.getNotifications();
      return notifications.filter((notif) => !notif.read).length;
    } catch (error) {
      console.error('Get unread count error:', error);
      return 0;
    }
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   */
  async markAsRead(notificationId) {
    try {
      await notificationAPI.markAsRead(notificationId);
    } catch (error) {
      console.error('Mark as read API error:', error);
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead() {
    try {
      await notificationAPI.markAllAsRead();
    } catch (error) {
      console.error('Mark all as read API error:', error);
    }
  }

  /**
   * Create a notification
   * @param {object} notificationData - Notification data
   * @param {string} notificationData.type - Notification type (success, info, warning, error)
   * @param {string} notificationData.title - Notification title
   * @param {string} notificationData.message - Notification message
   * @param {string} notificationData.userId - User ID
   */
  async createNotification(notificationData) {
    try {
      const notification = await notificationAPI.createNotification(notificationData);
      return notification;
    } catch (error) {
      console.error('Create notification API error:', error);
      // Return a local notification if API fails
      return {
        id: Date.now().toString(),
        ...notificationData,
        read: false,
        createdAt: new Date().toISOString(),
      };
    }
  }

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   */
  async deleteNotification(notificationId) {
    try {
      await notificationAPI.deleteNotification(notificationId);
    } catch (error) {
      console.error('Delete notification API error:', error);
    }
  }

  /**
   * Clear all notifications for current user
   */
  async clearAll() {
    try {
      await notificationAPI.clearAllNotifications();
    } catch (error) {
      console.error('Clear all notifications API error:', error);
    }
  }
}

export const notificationService = new NotificationService();
