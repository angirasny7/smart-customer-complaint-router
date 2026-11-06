import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-[12px] px-2.5 py-0.5 font-medium',
    lg: 'text-[13px] px-3 py-1 font-semibold',
  };

  const variantClasses = {
    primary: 'bg-[#EDE9FE] text-[#635BFF] border-[#DDD6FE] font-medium',
    secondary: 'bg-[#F8F9FC] text-[#171A35] border-[#E7E5F2] font-medium',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-medium',
    warning: 'bg-amber-50 text-amber-900 border-amber-200/80 font-medium',
    danger: 'bg-rose-50 text-rose-800 border-rose-200/80 font-medium',
    info: 'bg-blue-50 text-blue-800 border-blue-200/80 font-medium',
    neutral: 'bg-[#F8F9FC] text-[#344054] border-[#E7E5F2] font-medium',
  };

  const dotColors = {
    primary: 'bg-[#635BFF]',
    secondary: 'bg-[#8E98B0]',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-rose-500',
    info: 'bg-blue-500',
    neutral: 'bg-[#8E98B0]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded-md border ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`} />}
      {children}
    </span>
  );
};
