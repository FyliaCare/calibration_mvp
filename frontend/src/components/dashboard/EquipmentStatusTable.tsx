import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { AlertCircle, CheckCircle, Clock, Wrench } from 'lucide-react';

interface Equipment {
  id: string;
  name: string;
  serialNumber: string;
  status: 'operational' | 'due' | 'overdue' | 'maintenance';
  nextCalibration: string;
  daysUntilDue: number;
  compliance: number;
}

interface EquipmentStatusTableProps {
  equipment: Equipment[];
}

export const EquipmentStatusTable: React.FC<EquipmentStatusTableProps> = ({ equipment }) => {
  const getStatusBadge = (status: Equipment['status']) => {
    switch (status) {
      case 'operational':
        return (
          <Badge variant="success" className="flex items-center gap-1">
            <CheckCircle className="h-3 w-3" />
            Operational
          </Badge>
        );
      case 'due':
        return (
          <Badge variant="warning" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Due Soon
          </Badge>
        );
      case 'overdue':
        return (
          <Badge variant="danger" className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Overdue
          </Badge>
        );
      case 'maintenance':
        return (
          <Badge variant="info" className="flex items-center gap-1">
            <Wrench className="h-3 w-3" />
            Maintenance
          </Badge>
        );
    }
  };

  const getProgressVariant = (compliance: number): 'default' | 'success' | 'warning' | 'danger' => {
    if (compliance >= 95) return 'success';
    if (compliance >= 80) return 'warning';
    return 'danger';
  };

  return (
    <Card>
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Equipment Status Overview</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Real-time monitoring of all equipment calibration status
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold">Equipment</th>
              <th className="text-left py-3 px-4 text-sm font-semibold">Serial Number</th>
              <th className="text-left py-3 px-4 text-sm font-semibold">Status</th>
              <th className="text-left py-3 px-4 text-sm font-semibold">Next Calibration</th>
              <th className="text-left py-3 px-4 text-sm font-semibold">Days Until Due</th>
              <th className="text-left py-3 px-4 text-sm font-semibold">Compliance</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
              >
                <td className="py-3 px-4 font-medium">{item.name}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{item.serialNumber}</td>
                <td className="py-3 px-4">{getStatusBadge(item.status)}</td>
                <td className="py-3 px-4 text-sm">{item.nextCalibration}</td>
                <td className="py-3 px-4 text-sm">
                  <span
                    className={
                      item.daysUntilDue < 0
                        ? 'text-red-600 font-semibold'
                        : item.daysUntilDue < 7
                        ? 'text-yellow-600 font-semibold'
                        : ''
                    }
                  >
                    {item.daysUntilDue < 0 ? `${Math.abs(item.daysUntilDue)} days overdue` : `${item.daysUntilDue} days`}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Progress
                      value={item.compliance}
                      variant={getProgressVariant(item.compliance)}
                      className="flex-1"
                    />
                    <span className="text-sm font-medium w-12">{item.compliance}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
