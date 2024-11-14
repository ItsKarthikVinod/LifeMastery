import React from 'react';

const Footer = () => {
  return (
    <footer className="w-full bg-gray-800 text-white py-4 ">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} Karthik Vinod. All rights reserved.
        </p>
        <p className="text-sm mt-2">
          <a
            href="mailto:karthivinu1122@gmail.com"
            className="text-teal-400 hover:text-teal-600 transition duration-200"
          >
            Contact me 
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
