import React from 'react';

const Footer = () => {
  return (
    <footer className="py-8 mt-12 border-t border-gray-200 dark:border-gray-800 text-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        © {new Date().getFullYear()} AlgoWiz. Built for SDE Interview Mastery.
      </p>
      <div className="mt-2 flex justify-center space-x-4 text-xs text-gray-400">
        <div>Built with ❤️ by Aditya</div>
      </div>
    </footer>
  );
};

export default Footer;