import React, { useState, Suspense } from 'react';
import Spline from '@splinetool/react-spline';

export const Interactive3DCharacter = ({ isEmailFocused, isPasswordFocused, isTyping }) => {
  const [splineLoaded, setSplineLoaded] = useState(false);

  return (
    <div className="w-full h-full flex items-center justify-center relative bg-transparent">
      <Suspense
        fallback={
          <div className="w-full h-[400px] flex items-center justify-center text-white/50 text-xs bg-transparent">
            <div className="w-6 h-6 border-2 border-amber-400/40 border-t-amber-400 rounded-full animate-spin mr-2" />
            Loading 3D Scene...
          </div>
        }
      >
        <div className="w-full h-[420px] min-h-[380px] bg-transparent flex items-center justify-center">
          <Spline
            scene="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"
            style={{ background: 'transparent', width: '100%', height: '100%' }}
            onLoad={() => setSplineLoaded(true)}
          />
        </div>
      </Suspense>
    </div>
  );
};
