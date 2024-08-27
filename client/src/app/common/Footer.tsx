import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="max-w-7xl mx-auto text-center">
        <p>© 2024 Go Fund Yourself. All rights reserved.</p>
        <p>
          Follow us on Instagram: 
          <a 
            href="https://www.instagram.com/roymazumder_" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-400 hover:underline ml-1"
          > 
            @roymazumder_
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
