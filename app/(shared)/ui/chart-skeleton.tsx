"use client"

import React from 'react';
import { Spinner } from './spinner';

interface ChartSkeletonProps {
  themeColor?: string;
}

const ChartSkeleton: React.FC<ChartSkeletonProps> = ({ themeColor }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Spinner style={{ color: themeColor }} className="w-8 h-8" />
    </div>
  );
};

export default ChartSkeleton;
