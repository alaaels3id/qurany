import React from 'react';

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`animate-pulse bg-slate-200/70 dark:bg-white/5 rounded-xl border border-slate-200/50 dark:border-white/5 ${className}`}
    />
  );
};
