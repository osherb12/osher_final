import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '', variant = 'rect' }) => {
  const baseClasses = "animate-pulse bg-dracula-current/60 rounded-lg";
  const variantClasses = {
    text: "h-4 w-3/4",
    rect: "h-32 w-full",
    circle: "h-12 w-12 rounded-full"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} />
  );
};

export const ProductSkeleton: React.FC = () => (
  <div className="bg-dracula-bg/40 border border-white/5 rounded-3xl p-5 flex flex-col gap-4">
    <Skeleton className="aspect-square w-full rounded-2xl" />
    <div className="flex flex-col gap-2">
      <Skeleton variant="text" className="w-1/3" />
      <Skeleton variant="text" className="w-full h-6" />
      <div className="flex justify-between items-center mt-2">
        <Skeleton variant="text" className="w-1/4 h-8" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
    </div>
  </div>
);

export const ProductDetailSkeleton: React.FC = () => (
  <div className="grid md:grid-cols-2 gap-16 items-start">
    <Skeleton className="aspect-square w-full rounded-3xl" />
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <Skeleton variant="text" className="w-20" />
        <Skeleton variant="text" className="w-full h-12" />
        <Skeleton variant="text" className="w-1/2 h-6" />
      </div>
      <Skeleton variant="text" className="w-full h-32" />
      <Skeleton variant="text" className="w-1/3 h-12" />
      <Skeleton className="w-full h-16 rounded-2xl" />
    </div>
  </div>
);
