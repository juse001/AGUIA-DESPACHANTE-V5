import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

type AlertType = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  dismissible?: boolean;
}

const iconMap: Record<AlertType, React.ReactNode> = {
  error: <AlertCircle className="w-5 h-5" />,
  success: <CheckCircle className="w-5 h-5" />,
  warning: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
};

const styleMap: Record<AlertType, { bg: string; border: string; icon: string; text: string }> = {
  error: {
    bg: 'bg-red-50',
    border: 'border-red-200',
    icon: 'text-red-600',
    text: 'text-red-700',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'text-green-600',
    text: 'text-green-700',
  },
  warning: {
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    icon: 'text-yellow-600',
    text: 'text-yellow-700',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'text-blue-600',
    text: 'text-blue-700',
  },
};

export const Alert: React.FC<AlertProps> = ({
  type,
  title,
  message,
  onClose,
  dismissible = true,
}) => {
  const [visible, setVisible] = React.useState(true);

  const handleClose = () => {
    setVisible(false);
    onClose?.();
  };

  if (!visible) return null;

  const styles = styleMap[type];

  return (
    <div className={`border ${styles.border} ${styles.bg} rounded-lg p-4 flex gap-3`}>
      <div className={styles.icon}>{iconMap[type]}</div>
      <div className="flex-1">
        {title && <h3 className={`font-semibold ${styles.text}`}>{title}</h3>}
        <p className={styles.text}>{message}</p>
      </div>
      {dismissible && (
        <button
          onClick={handleClose}
          className={`${styles.text} hover:opacity-75 flex-shrink-0`}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
