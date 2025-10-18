import { useState } from 'react';
import { X, CheckCircle, Calendar, Download, Mail, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

interface ActionableNotification {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  timestamp: string;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
    icon?: React.ReactNode;
  }[];
  dismissible?: boolean;
}

interface ActionableNotificationsProps {
  notifications?: ActionableNotification[];
}

export const ActionableNotifications = ({ notifications = [] }: ActionableNotificationsProps) => {
  const [visible, setVisible] = useState<string[]>(
    notifications.map(n => n.id)
  );

  // Mock notifications for demonstration
  const mockNotifications: ActionableNotification[] = [
    {
      id: '1',
      type: 'critical',
      title: '3 Calibrations Overdue',
      message: 'DMM-2500, PG-1000, and TS-550 are past their calibration due dates.',
      timestamp: '2 hours ago',
      actions: [
        {
          label: 'Schedule All',
          onClick: () => console.log('Schedule all overdue'),
          variant: 'primary',
          icon: <Calendar className="h-3 w-3" />,
        },
        {
          label: 'View Details',
          onClick: () => console.log('View details'),
          variant: 'secondary',
          icon: <Eye className="h-3 w-3" />,
        },
      ],
      dismissible: true,
    },
    {
      id: '2',
      type: 'warning',
      title: '5 Calibrations Due This Week',
      message: 'Multiple equipment items require calibration within the next 7 days.',
      timestamp: '5 hours ago',
      actions: [
        {
          label: 'Review Schedule',
          onClick: () => console.log('Review schedule'),
          variant: 'primary',
          icon: <Calendar className="h-3 w-3" />,
        },
      ],
      dismissible: true,
    },
    {
      id: '3',
      type: 'info',
      title: '7 Certificates Ready',
      message: 'Calibration certificates are ready for download and client delivery.',
      timestamp: '1 day ago',
      actions: [
        {
          label: 'Download All',
          onClick: () => console.log('Download all certificates'),
          variant: 'primary',
          icon: <Download className="h-3 w-3" />,
        },
        {
          label: 'Email Clients',
          onClick: () => console.log('Email clients'),
          variant: 'secondary',
          icon: <Mail className="h-3 w-3" />,
        },
      ],
      dismissible: true,
    },
    {
      id: '4',
      type: 'success',
      title: 'Monthly Target Achieved',
      message: 'You have completed 95% of planned calibrations for October 2025.',
      timestamp: '2 days ago',
      actions: [
        {
          label: 'View Report',
          onClick: () => console.log('View report'),
          variant: 'primary',
          icon: <CheckCircle className="h-3 w-3" />,
        },
      ],
      dismissible: true,
    },
  ];

  const displayNotifications = notifications.length > 0 ? notifications : mockNotifications;

  const handleDismiss = (id: string) => {
    setVisible(prev => prev.filter(nId => nId !== id));
  };

  const getNotificationStyles = (type: string) => {
    switch (type) {
      case 'critical':
        return {
          border: 'border-l-4 border-red-500',
          bg: 'bg-red-50',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          titleColor: 'text-red-900',
        };
      case 'warning':
        return {
          border: 'border-l-4 border-yellow-500',
          bg: 'bg-yellow-50',
          iconBg: 'bg-yellow-100',
          iconColor: 'text-yellow-600',
          titleColor: 'text-yellow-900',
        };
      case 'info':
        return {
          border: 'border-l-4 border-blue-500',
          bg: 'bg-blue-50',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-900',
        };
      case 'success':
        return {
          border: 'border-l-4 border-green-500',
          bg: 'bg-green-50',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          titleColor: 'text-green-900',
        };
      default:
        return {
          border: 'border-l-4 border-gray-500',
          bg: 'bg-gray-50',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          titleColor: 'text-gray-900',
        };
    }
  };

  const visibleNotifications = displayNotifications.filter(n => visible.includes(n.id));

  if (visibleNotifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <CheckCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
        <p className="font-medium">All caught up!</p>
        <p className="text-sm mt-1">No new notifications</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {visibleNotifications.map((notification) => {
        const styles = getNotificationStyles(notification.type);
        
        return (
          <div
            key={notification.id}
            className={`${styles.bg} ${styles.border} rounded-lg p-4 animate-slide-in-from-top`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-semibold ${styles.titleColor}`}>
                    {notification.title}
                  </h4>
                  <Badge variant={notification.type === 'critical' ? 'danger' : 'default'}>
                    {notification.type}
                  </Badge>
                </div>
                <p className="text-sm text-gray-700 mb-2">{notification.message}</p>
                <p className="text-xs text-gray-500">{notification.timestamp}</p>

                {/* Action Buttons */}
                {notification.actions && notification.actions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {notification.actions.map((action, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant={action.variant === 'primary' ? 'default' : 'outline'}
                        onClick={action.onClick}
                        className="text-xs"
                      >
                        {action.icon && <span className="mr-1">{action.icon}</span>}
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dismiss Button */}
              {notification.dismissible && (
                <button
                  onClick={() => handleDismiss(notification.id)}
                  className="p-1 hover:bg-gray-200/50 rounded transition-colors flex-shrink-0"
                >
                  <X className="h-4 w-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
