import * as React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  dismissible?: boolean;
  onDismiss?: () => void;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', dismissible = false, onDismiss, children, ...props }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true);

    const handleDismiss = () => {
      setIsVisible(false);
      onDismiss?.();
    };

    if (!isVisible) return null;

    const icons = {
      default: <Info className="h-4 w-4" />,
      success: <CheckCircle className="h-4 w-4" />,
      warning: <AlertTriangle className="h-4 w-4" />,
      danger: <AlertCircle className="h-4 w-4" />,
      info: <Info className="h-4 w-4" />,
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative rounded-lg border p-4',
          {
            'bg-background text-foreground': variant === 'default',
            'bg-green-50 text-green-900 border-green-200 dark:bg-green-900/20 dark:text-green-200': variant === 'success',
            'bg-yellow-50 text-yellow-900 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-200': variant === 'warning',
            'bg-red-50 text-red-900 border-red-200 dark:bg-red-900/20 dark:text-red-200': variant === 'danger',
            'bg-blue-50 text-blue-900 border-blue-200 dark:bg-blue-900/20 dark:text-blue-200': variant === 'info',
          },
          className
        )}
        {...props}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">{icons[variant]}</div>
          <div className="flex-1">{children}</div>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);
Alert.displayName = 'Alert';

const AlertTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 font-semibold leading-none tracking-tight', className)}
      {...props}
    />
  )
);
AlertTitle.displayName = 'AlertTitle';

const AlertDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('text-sm opacity-90', className)}
      {...props}
    />
  )
);
AlertDescription.displayName = 'AlertDescription';

export { Alert, AlertTitle, AlertDescription };
