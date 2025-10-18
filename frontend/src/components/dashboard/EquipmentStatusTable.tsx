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
    <Card className="border-0">
      <div className="mb-6 px-6 pt-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <Wrench className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Equipment Status Overview
            </h3>
            <p className="text-sm text-muted-foreground">
              Real-time monitoring of all equipment calibration status
            </p>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700">
            <tr className="border-b border-border">
              <th className="text-left py-4 px-6 text-sm font-bold uppercase tracking-wider">Equipment</th>
              <th className="text-left py-4 px-6 text-sm font-bold uppercase tracking-wider">Serial Number</th>
              <th className="text-left py-4 px-6 text-sm font-bold uppercase tracking-wider">Status</th>
              <th className="text-left py-4 px-6 text-sm font-bold uppercase tracking-wider">Next Calibration</th>
              <th className="text-left py-4 px-6 text-sm font-bold uppercase tracking-wider">Days Until Due</th>
              <th className="text-left py-4 px-6 text-sm font-bold uppercase tracking-wider">Compliance</th>
            </tr>
          </thead>
          <tbody>
            {equipment.map((item) => (
              <tr
                key={item.id}
                className="border-b border-border last:border-0 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-200"
              >
                <td className="py-4 px-6 font-semibold">{item.name}</td>
                <td className="py-4 px-6 text-sm text-muted-foreground font-mono">{item.serialNumber}</td>
                <td className="py-4 px-6">{getStatusBadge(item.status)}</td>
                <td className="py-4 px-6 text-sm font-medium">{item.nextCalibration}</td>
                <td className="py-4 px-6 text-sm">
                  <span
                    className={
                      item.daysUntilDue < 0
                        ? 'text-red-600 font-bold'
                        : item.daysUntilDue < 7
                        ? 'text-yellow-600 font-bold'
                        : 'text-green-600 font-semibold'
                    }
                  >
                    {item.daysUntilDue < 0 ? `${Math.abs(item.daysUntilDue)} days overdue` : `${item.daysUntilDue} days`}
                  </span>
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <Progress
                      value={item.compliance}
                      variant={getProgressVariant(item.compliance)}
                      className="flex-1 h-3"
                    />
                    <span className="text-sm font-bold w-14">{item.compliance}%</span>
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
