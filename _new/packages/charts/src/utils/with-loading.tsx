'use client'

import React, { useEffect, useState } from 'react';
import { WithThemeColor } from '../types';

// Placeholder for ChartSkeleton - this should be moved to a separate component
const ChartSkeleton: React.FC<WithThemeColor> = ({ themeColor = '#22C55E' }) => (
   <div
      style={{
         width: '100%',
         height: '100%',
         minHeight: '400px',
         background: `linear-gradient(90deg, 
        rgba(255,255,255,0.03) 0%, 
        rgba(255,255,255,0.05) 50%, 
        rgba(255,255,255,0.03) 100%)`,
         borderRadius: '8px',
         position: 'relative',
         overflow: 'hidden'
      }}
   >
      <div
         style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(90deg, 
          transparent 0%, 
          ${themeColor}20 50%, 
          transparent 100%)`,
            animation: 'shimmer 1.5s infinite'
         }}
      />
      <style>{`
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
    `}</style>
   </div>
);

export function withLoading<P extends WithThemeColor>(
	WrappedComponent: React.ComponentType<P>,
	loadingDelay: number = 1000
) {
	return function WithLoadingComponent(props: P) {
		const isTestEnv = typeof process !== 'undefined' && process.env.NODE_ENV === 'test';
		const [isLoading, setIsLoading] = useState(!isTestEnv);

		useEffect(() => {
			if (isTestEnv) {
				return;
			}

			const timer = setTimeout(() => {
				setIsLoading(false);
			}, loadingDelay);

			return () => clearTimeout(timer);
		}, [isTestEnv, loadingDelay]);

		if (isLoading) {
			return <ChartSkeleton themeColor={props.themeColor} />;
		}

		return <WrappedComponent {...props} />;
	};
}