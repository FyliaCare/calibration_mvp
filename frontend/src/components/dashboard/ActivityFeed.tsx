import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  CheckCircle,
  AlertCircle,
  Clock,
  Wrench,
  FileText,
  UserPlus,
} from 'lucide-react';

interface Activity {
  id: string;
  type: 'calibration' | 'maintenance' | 'alert' | 'report' | 'user';
  title: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'calibration':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'maintenance':
        return <Wrench className="h-4 w-4 text-blue-600" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'report':
        return <FileText className="h-4 w-4 text-purple-600" />;
      case 'user':
        return <UserPlus className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getActivityBadge = (type: Activity['type']) => {
    switch (type) {
      case 'calibration':
        return <Badge variant="success">Calibration</Badge>;
      case 'maintenance':
        return <Badge variant="info">Maintenance</Badge>;
      case 'alert':
        return <Badge variant="danger">Alert</Badge>;
      case 'report':
        return <Badge variant="outline">Report</Badge>;
      case 'user':
        return <Badge variant="warning">User</Badge>;
    }
  };

  return (
    <Card className="border-0">
      <div className="mb-6 p-6 pb-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg">
            <Clock className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Recent Activity
            </h3>
            <p className="text-sm text-muted-foreground">
              Latest system events and notifications
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-4 p-6">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative">
            {index !== activities.length - 1 && (
              <div className="absolute left-5 top-12 w-0.5 h-full bg-gradient-to-b from-border to-transparent" />
            )}
            <div className="flex gap-4">
              <div className="flex-shrink-0 mt-1 w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center relative z-10 shadow-lg ring-2 ring-white dark:ring-gray-800">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-base">{activity.title}</h4>
                  {getActivityBadge(activity.type)}
                </div>
                <p className="text-sm text-muted-foreground mb-2 leading-relaxed">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                  <Clock className="h-3 w-3" />
                  <span>{activity.timestamp}</span>
                  {activity.user && (
                    <>
                      <span>•</span>
                      <span className="text-primary">{activity.user}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
