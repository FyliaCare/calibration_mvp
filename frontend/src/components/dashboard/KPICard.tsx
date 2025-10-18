import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { Card } from '@/components/ui/Card';

interface KPICardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon: React.ReactNode;
  colorScheme: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  target?: string;
  status?: 'excellent' | 'good' | 'warning' | 'critical';
}

export const KPICard = ({ 
  title, 
  value, 
  unit, 
  trend, 
  trendValue, 
  icon, 
  colorScheme,
  target,
  status = 'good'
}: KPICardProps) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
      text: 'text-blue-600',
      border: 'border-blue-200',
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
      text: 'text-green-600',
      border: 'border-green-200',
    },
    purple: {
      bg: 'bg-purple-50',
      iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
      text: 'text-purple-600',
      border: 'border-purple-200',
    },
    orange: {
      bg: 'bg-orange-50',
      iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
      text: 'text-orange-600',
      border: 'border-orange-200',
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-gradient-to-br from-red-500 to-red-600',
      text: 'text-red-600',
      border: 'border-red-200',
    },
  };

  const statusColors = {
    excellent: 'bg-green-500',
    good: 'bg-blue-500',
    warning: 'bg-yellow-500',
    critical: 'bg-red-500',
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="h-3 w-3" />;
    if (trend === 'down') return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (trend === 'up') return 'text-green-600 bg-green-100';
    if (trend === 'down') return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const colors = colorClasses[colorScheme];

  return (
    <Card className={`${colors.bg} border-2 ${colors.border} hover:shadow-lg transition-all duration-200 relative overflow-hidden`}>
      {/* Status Indicator */}
      <div className={`absolute top-0 right-0 w-2 h-full ${statusColors[status]}`} />

      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-bold text-gray-900">{value}</span>
              {unit && <span className="text-sm text-gray-500 font-medium">{unit}</span>}
            </div>
          </div>
          <div className={`${colors.iconBg} p-3 rounded-lg shadow-md text-white`}>
            {icon}
          </div>
        </div>

        {/* Trend or Target */}
        <div className="flex items-center justify-between">
          {trend && trendValue && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
          {target && (
            <div className="text-xs text-gray-500">
              Target: <span className="font-semibold">{target}</span>
            </div>
          )}
          {!trend && !target && <div />}
        </div>

        {/* Progress Bar (optional) */}
        {target && (
          <div className="mt-3">
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${colors.iconBg} transition-all duration-500`}
                style={{ width: `${Math.min((parseFloat(value.toString()) / parseFloat(target)) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
