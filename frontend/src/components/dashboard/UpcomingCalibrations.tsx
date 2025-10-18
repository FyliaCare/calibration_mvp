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
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Upcoming Calibrations</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Scheduled calibration activities for the next 7 days
        </p>
      </div>
      <div className="space-y-3">
        {calibrations.map((calibration) => (
          <div
            key={calibration.id}
            className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-semibold">{calibration.equipmentName}</h4>
                  {getPriorityBadge(calibration.priority)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {calibration.date} at {calibration.time}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{calibration.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{calibration.technician}</span>
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
