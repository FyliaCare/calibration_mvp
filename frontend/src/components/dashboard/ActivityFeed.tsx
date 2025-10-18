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
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Latest system events and notifications
        </p>
      </div>
      <div className="space-y-3">
        {activities.map((activity, index) => (
          <div key={activity.id} className="relative">
            {index !== activities.length - 1 && (
              <div className="absolute left-5 top-8 w-px h-full bg-border" />
            )}
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1 w-10 h-10 rounded-full bg-muted flex items-center justify-center relative z-10">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-medium text-sm">{activity.title}</h4>
                  {getActivityBadge(activity.type)}
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {activity.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>{activity.timestamp}</span>
                  {activity.user && (
                    <>
                      <span>•</span>
                      <span>{activity.user}</span>
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
