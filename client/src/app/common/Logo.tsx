'use client';

import Image from 'next/image';

const Logo = () => {
  return (
    <div className="flex justify-center items-center h-full w-auto">
      <div className="relative w-24 md:w-32 lg:w-40"> {/* Responsive sizing */}
        <Image
          src="/logo.jpeg" // Correct path for images in the public folder
          alt="Logo"
          layout="fill" // Fill the container
          objectFit="contain" // Ensure it scales within bounds
          className="rounded-full"
        />
      </div>
    </div>
  );
};

export default Logo;
