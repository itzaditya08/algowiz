import React from 'react';
import Sidebar from '../common/Sidebar';
import Header from '../common/Header';
import { useTheme } from '../../contexts/ThemeContext';

const MainLayout = ({ children }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark' : ''}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
          <div className="container mx-auto px-6 py-8 h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;