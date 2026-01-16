/**
 * Notification Service
 * Handles user notifications and alerts
 * Ready for backend API integration
 */

import { storage } from './storageService';
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
  getNotifications() {
    const token = getToken();
    if (!token) return [];

    const allNotifications = storage.getItem('notifications') || [];
    return allNotifications.filter((notif) => notif.userId === token);
  }

  /**
   * Get unread notification count
   * @returns {number} - Count of unread notifications
   */
  getUnreadCount() {
    const notifications = this.getNotifications();
    return notifications.filter((notif) => !notif.read).length;
  }

  /**
   * Mark notification as read
   * @param {string} notificationId - Notification ID
   */
  markAsRead(notificationId) {
    const token = getToken();
    if (!token) return;

    const allNotifications = storage.getItem('notifications') || [];
    const notification = allNotifications.find(
      (notif) => notif.id === notificationId && notif.userId === token
    );

    if (notification) {
      notification.read = true;
      notification.readAt = new Date().toISOString();
      storage.setItem('notifications', allNotifications);
    }
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead() {
    const token = getToken();
    if (!token) return;

    const allNotifications = storage.getItem('notifications') || [];
    allNotifications.forEach((notif) => {
      if (notif.userId === token && !notif.read) {
        notif.read = true;
        notif.readAt = new Date().toISOString();
      }
    });
    storage.setItem('notifications', allNotifications);
  }

  /**
   * Create a notification
   * @param {object} notificationData - Notification data
   * @param {string} notificationData.type - Notification type (success, info, warning, error)
   * @param {string} notificationData.title - Notification title
   * @param {string} notificationData.message - Notification message
   * @param {string} notificationData.userId - User ID
   */
  createNotification(notificationData) {
    const notification = {
      id: Date.now().toString(),
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString(),
    };

    const allNotifications = storage.getItem('notifications') || [];
    allNotifications.push(notification);
    storage.setItem('notifications', allNotifications);

    return notification;
  }

  /**
   * Delete a notification
   * @param {string} notificationId - Notification ID
   */
  deleteNotification(notificationId) {
    const token = getToken();
    if (!token) return;

    const allNotifications = storage.getItem('notifications') || [];
    const filtered = allNotifications.filter(
      (notif) => !(notif.id === notificationId && notif.userId === token)
    );
    storage.setItem('notifications', filtered);
  }

  /**
   * Clear all notifications for current user
   */
  clearAll() {
    const token = getToken();
    if (!token) return;

    const allNotifications = storage.getItem('notifications') || [];
    const filtered = allNotifications.filter((notif) => notif.userId !== token);
    storage.setItem('notifications', filtered);
  }
}

export const notificationService = new NotificationService();
