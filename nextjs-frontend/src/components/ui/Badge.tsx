import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
}

const badgeVariants = {
  default: 'bg-blue-600 text-white',
  secondary: 'bg-gray-100 text-gray-900',
  outline: 'border border-gray-300 bg-white text-gray-700',
  destructive: 'bg-red-600 text-white',
};

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'default', 
  className = '' 
}) => {
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${badgeVariants[variant]} ${className}`}>
      {children}
    </span>
  );
};
