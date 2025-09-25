import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'available' | 'busy' | 'pending' | 'completed' | 'error' | 'active' | 'inactive';
  text?: string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  text, 
  showIcon = true, 
  size = 'md' 
}) => {
  const statusConfig = {
    available: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
      text: text || 'Available'
    },
    busy: {
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: XCircle,
      text: text || 'Busy'
    },
    pending: {
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      icon: Clock,
      text: text || 'Pending'
    },
    completed: {
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      icon: CheckCircle,
      text: text || 'Completed'
    },
    error: {
      color: 'bg-red-100 text-red-800 border-red-200',
      icon: AlertCircle,
      text: text || 'Error'
    },
    active: {
      color: 'bg-green-100 text-green-800 border-green-200',
      icon: CheckCircle,
      text: text || 'Active'
    },
    inactive: {
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      icon: XCircle,
      text: text || 'Inactive'
    }
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-2.5 py-0.5 text-sm',
    lg: 'px-3 py-1 text-base'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3 h-3',
    lg: 'w-4 h-4'
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center font-medium rounded-full border ${config.color} ${sizeClasses[size]}`}
    >
      {showIcon && (
        <Icon className={`${iconSizes[size]} mr-1`} />
      )}
      {config.text}
    </motion.span>
  );
};

export default StatusBadge;
