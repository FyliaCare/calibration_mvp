import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, MapPin, User } from 'lucide-react';

interface Calibration {
  id: string;
  equipmentName: string;
  date: string;
  time: string;
  location: string;
  technician: string;
  priority: 'high' | 'medium' | 'low';
}

interface UpcomingCalibrationsProps {
  calibrations: Calibration[];
}

export const UpcomingCalibrations: React.FC<UpcomingCalibrationsProps> = ({ calibrations }) => {
  const getPriorityBadge = (priority: Calibration['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="danger">High Priority</Badge>;
      case 'medium':
        return <Badge variant="warning">Medium</Badge>;
      case 'low':
        return <Badge variant="success">Low</Badge>;
    }
  };

  return (
    <Card className="border-0">
      <div className="mb-6 p-6 pb-0">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg">
            <Calendar className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Upcoming Calibrations
            </h3>
            <p className="text-sm text-muted-foreground">
              Scheduled calibration activities for the next 7 days
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-3 p-6">
        {calibrations.map((calibration, index) => (
          <div
            key={calibration.id}
            className="p-5 border-2 border-border rounded-xl hover:border-primary hover:shadow-lg hover:scale-[1.02] transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h4 className="font-bold text-lg">{calibration.equipmentName}</h4>
                  {getPriorityBadge(calibration.priority)}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">
                      {calibration.date} at {calibration.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span className="font-medium">{calibration.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4 text-purple-600" />
                    <span className="font-medium">{calibration.technician}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
