import React, { useState, useEffect, useRef } from 'react';
import { notificationService } from '../../services/notificationService';
import './NotificationBell.css';

/**
 * NotificationBell Component
 * Displays notification bell icon with unread count and dropdown
 */
const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    loadNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  /**
   * Load notifications
   */
  const loadNotifications = async () => {
    try {
      const notifs = await notificationService.getNotifications();
      const unread = await notificationService.getUnreadCount();
      if (Array.isArray(notifs)) {
        setNotifications(notifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      } else {
        setNotifications([]);
      }
      setUnreadCount(typeof unread === 'number' ? unread : 0);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  /**
   * Toggle dropdown
   */
  const toggleDropdown = async () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Mark all as read when opening
      await notificationService.markAllAsRead();
      loadNotifications();
    }
  };

  /**
   * Handle click outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  /**
   * Delete notification
   */
  const handleDelete = async (notificationId) => {
    await notificationService.deleteNotification(notificationId);
    loadNotifications();
  };

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button
        className="notification-bell__button"
        onClick={toggleDropdown}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
      >
        <span className="notification-bell__icon">🔔</span>
        {unreadCount > 0 && (
          <span className="notification-bell__badge" aria-hidden="true">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-bell__dropdown" role="menu">
          <div className="notification-bell__header">
            <h3>Notifications</h3>
            {notifications.length > 0 && (
              <button
                onClick={async () => {
                  await notificationService.clearAll();
                  loadNotifications();
                }}
                className="notification-bell__clear"
              >
                Clear All
              </button>
            )}
          </div>

          <div className="notification-bell__list">
            {notifications.length === 0 ? (
              <div className="notification-bell__empty">No notifications</div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`notification-bell__item ${!notif.read ? 'unread' : ''}`}
                  role="menuitem"
                >
                  <div className="notification-bell__item-content">
                    <div className={`notification-bell__item-type ${notif.type}`} />
                    <div className="notification-bell__item-text">
                      <div className="notification-bell__item-title">{notif.title}</div>
                      <div className="notification-bell__item-message">{notif.message}</div>
                      <div className="notification-bell__item-time">
                        {new Date(notif.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(notif.id)}
                    className="notification-bell__delete"
                    aria-label="Delete notification"
                  >
                    ×
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
