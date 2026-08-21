import React from 'react';
import { CheckCircle2, Info, Bell, X } from 'lucide-react';
import { useDashboard } from '../../context/DashboardContext';

const Toast = () => {
  const { toast } = useDashboard();

  if (!toast.visible) return null;

  return (
    <div className={`db-toast db-toast-${toast.type}`}>
      <div className="db-toast-icon">
        {toast.type === 'success' && <CheckCircle2 size={16} />}
        {toast.type === 'info' && <Info size={16} />}
        {toast.type === 'alert' && <Bell size={16} />}
      </div>
      <div className="db-toast-message">{toast.message}</div>
    </div>
  );
};

export default Toast;
