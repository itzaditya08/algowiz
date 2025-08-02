import React from 'react';
import ThemeToggle from './ThemeToggle';
import { useLocation } from 'react-router-dom';
import { getTitleAndDescription, getCategoryIcon } from '../../utils/helpers';

const Header = () => {
  const location = useLocation();
  const { title, description } = getTitleAndDescription(location.pathname);
  const Icon = getCategoryIcon(location.pathname);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center space-x-4">
        {Icon && <Icon className="w-8 h-8 text-primary-blue" />}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <ThemeToggle />
    </header>
  );
};

export default Header;