import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'text-[13px] px-3 py-1.5 rounded-lg gap-1.5 font-medium',
    md: 'text-[14px] px-4 py-2 rounded-lg gap-2 font-semibold',
    lg: 'text-[15px] px-5 py-2.5 rounded-lg gap-2.5 font-semibold',
  };

  const variantClasses = {
    primary:
      'bg-[#635BFF] hover:bg-[#5247EE] active:bg-[#4338CA] text-white shadow-[0_1px_2px_rgba(99,91,255,0.25)] focus:ring-2 focus:ring-[#635BFF]/30 transition-all',
    secondary:
      'bg-[#11152B] hover:bg-[#1A1F3D] text-white shadow-2xs transition-colors',
    outline:
      'bg-white hover:bg-[#F8F9FC] text-[#171A35] border border-[#E7E5F2] shadow-2xs transition-colors',
    ghost:
      'bg-transparent hover:bg-[#F0EEF9] text-[#475467] hover:text-[#171A35] transition-colors font-medium',
    danger:
      'bg-rose-600 hover:bg-rose-500 text-white shadow-2xs transition-colors',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`inline-flex items-center justify-center transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
      ) : (
        icon && <span className="shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </button>
  );
};
