import React from 'react';
import { Tag, TrendingDown, Bell, CheckCircle2, ArrowRight } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const NotificationDropdown = () => {
  const {
    notifications,
    notifDropdownOpen,
    setNotifDropdownOpen,
    markAllNotificationsRead,
    viewPriceComparison,
  } = useDashboard();

  if (!notifDropdownOpen) return null;

  const handleItemClick = (notif) => {
    setNotifDropdownOpen(false);
    if (notif.productId) {
      viewPriceComparison(notif.productId);
    }
  };

  return (
    <>
      <div
        className="db-notif-backdrop"
        onClick={() => setNotifDropdownOpen(false)}
      />

      <div className="db-notif-dropdown">
        <div className="db-notif-header">
          <div>
            <h4 className="db-notif-title">Notifications</h4>
            <span className="db-notif-sub">
              {notifications.filter((n) => n.unread).length} unread alerts
            </span>
          </div>
          <button
            className="db-btn-clean db-btn-clean-outline"
            style={{ fontSize: '0.72rem', padding: '0.2rem 0.5rem' }}
            onClick={markAllNotificationsRead}
          >
            Mark all read
          </button>
        </div>

        <div className="db-notif-list">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`db-notif-item ${n.unread ? 'unread' : ''}`}
              onClick={() => handleItemClick(n)}
            >
              <div className={`db-notif-icon-box db-notif-icon-${n.type}`}>
                {n.type === 'drop' && <TrendingDown size={14} />}
                {n.type === 'deal' && <Tag size={14} />}
                {n.type === 'alert' && <Bell size={14} />}
              </div>
              <div className="db-notif-content">
                <div className="db-notif-item-title">{n.title}</div>
                <div className="db-notif-item-msg">{n.message}</div>
                <div className="db-notif-item-time">{n.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="db-notif-footer">
          <span>Real-time price drop alerts</span>
        </div>
      </div>
    </>
  );
};

export default NotificationDropdown;
