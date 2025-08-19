import React from 'react';
import toast, { Toaster, Toast as HotToast } from 'react-hot-toast';
import { CheckCircle, AlertCircle, XCircle, Info, X } from 'lucide-react';
import clsx from 'clsx';
import './Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  /** Toast message */
  message: string;
  /** Toast type */
  type?: ToastType;
  /** Auto dismiss duration in milliseconds */
  duration?: number;
  /** Whether to show close button */
  dismissible?: boolean;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const CustomToast: React.FC<{ t: HotToast; type: ToastType; message: string; dismissible?: boolean }> = ({
  t,
  type,
  message,
  dismissible = true,
}) => {
  const Icon = toastIcons[type];
  
  return (
    <div
      className={clsx('ds-toast', `ds-toast--${type}`, {
        'ds-toast--enter': t.visible,
        'ds-toast--exit': !t.visible,
      })}
    >
      <div className="ds-toast__icon">
        <Icon size={20} />
      </div>
      <div className="ds-toast__message">{message}</div>
      {dismissible && (
        <button
          className="ds-toast__close"
          onClick={() => toast.dismiss(t.id)}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

// Toast methods
export const showToast = {
  success: (message: string, options?: Partial<ToastProps>) => {
    toast.custom(
      (t) => (
        <CustomToast
          t={t}
          type="success"
          message={message}
          dismissible={options?.dismissible}
        />
      ),
      { duration: options?.duration || 4000 }
    );
  },
  
  error: (message: string, options?: Partial<ToastProps>) => {
    toast.custom(
      (t) => (
        <CustomToast
          t={t}
          type="error"
          message={message}
          dismissible={options?.dismissible}
        />
      ),
      { duration: options?.duration || 6000 }
    );
  },
  
  warning: (message: string, options?: Partial<ToastProps>) => {
    toast.custom(
      (t) => (
        <CustomToast
          t={t}
          type="warning"
          message={message}
          dismissible={options?.dismissible}
        />
      ),
      { duration: options?.duration || 5000 }
    );
  },
  
  info: (message: string, options?: Partial<ToastProps>) => {
    toast.custom(
      (t) => (
        <CustomToast
          t={t}
          type="info"
          message={message}
          dismissible={options?.dismissible}
        />
      ),
      { duration: options?.duration || 4000 }
    );
  },
};

// Toast container component
export const ToastContainer: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      containerClassName="ds-toast-container"
      gutter={8}
      toastOptions={{
        className: '',
        style: {},
      }}
    />
  );
};

// Hook for programmatic toast usage
export const useToast = () => {
  return {
    success: showToast.success,
    error: showToast.error,
    warning: showToast.warning,
    info: showToast.info,
    dismiss: (toastId?: string) => toast.dismiss(toastId),
    dismissAll: () => toast.dismiss(),
  };
};