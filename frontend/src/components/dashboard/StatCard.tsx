import React from 'react';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}) => {
  const variantStyles = {
    default: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50',
    success: 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50',
    warning: 'bg-gradient-to-br from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/50',
    danger: 'bg-gradient-to-br from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/50',
    info: 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/50',
  };

  return (
    <Card className={cn('hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800', className)}>
      <div className="relative">
        {/* Decorative gradient overlay */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
        
        <div className="flex items-center justify-between relative z-10">
          <div className="flex-1">
            <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
            <div className="flex items-baseline gap-3 mt-3">
              <h3 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                {value}
              </h3>
              {trend && (
                <span
                  className={cn(
                    'text-sm font-bold px-2 py-1 rounded-full',
                    trend.isPositive 
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  )}
                >
                  {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                </span>
              )}
            </div>
            {description && (
              <p className="text-sm text-muted-foreground mt-2 font-medium">{description}</p>
            )}
          </div>
          <div className={cn('p-4 rounded-2xl transform hover:rotate-12 transition-transform duration-300', variantStyles[variant])}>
            <Icon className="h-8 w-8" />
          </div>
        </div>
      </div>
    </Card>
  );
};
