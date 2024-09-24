import React from 'react';

const TriangleIcon: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="relative w-32 h-32">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Large triangle */}
            <path d="M50 20 L85 80 H15 L50 20 Z" stroke="white" strokeWidth="2" fill="none" />
            {/* Small triangle above */}
            <path d="M50 35 L60 50 H40 L50 35 Z" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TriangleIcon;
