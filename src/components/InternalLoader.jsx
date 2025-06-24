import React from 'react';

const InternalLoader = ({ text = 'Loading' }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      <div className="flex flex-col items-center gap-5">
        {/* Slightly brighter gradient arc spinner */}
        <div
          className="w-12 h-12 rounded-full animate-spin"
          style={{
            background: 'conic-gradient(from 0deg, #14b8a6 0%, #3b82f6 80%, transparent 100%)',
            mask: 'radial-gradient(farthest-side, transparent 65%, black 66%)',
            WebkitMask: 'radial-gradient(farthest-side, transparent 65%, black 66%)',
          }}
        />

        {/* Animated text with livelier bouncing dots */}
        <p className="text-blue-800 font-semibold text-lg flex items-center tracking-wide">
          {text}
          <span className="ml-1 animate-bounce text-blue-800">.</span>
          <span className="ml-0.5 animate-bounce [animation-delay:0.15s] text-blue-800">.</span>
          <span className="ml-0.5 animate-bounce [animation-delay:0.3s] text-blue-800">.</span>
        </p>
      </div>
    </div>
  );
};

export default InternalLoader;
