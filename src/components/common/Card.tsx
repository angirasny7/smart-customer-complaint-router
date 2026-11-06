import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  noPadding?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
  noPadding = false,
}) => {
  return (
    <div
      className={`bg-white rounded-xl border border-[#E7E5F2] shadow-[0_1px_3px_rgba(23,26,53,0.04),0_1px_2px_rgba(23,26,53,0.02)] ${className}`}
    >
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F0EEF9]">
          <div>
            {title && <h3 className="text-[18px] font-semibold text-[#171A35] tracking-tight">{title}</h3>}
            {subtitle && <p className="text-[14px] text-[#475467] mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : 'p-5'}>{children}</div>
    </div>
  );
};
