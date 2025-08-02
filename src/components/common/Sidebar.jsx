import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  GitGraph, Cpu, UnfoldHorizontal, Table, Box, Search, MessageSquare, HardDrive, List,
} from 'lucide-react';
import algowizLogo from '../../assets/logo.png';

const navItems = [
  { name: 'Graph Algorithms', path: '/graph-algorithms', icon: GitGraph },
  { name: 'OS Scheduling', path: '/os-scheduling-algorithms', icon: Cpu },
  { name: 'Sorting Algorithms', path: '/sorting-algorithms', icon: UnfoldHorizontal },
  { name: 'Cache Eviction', path: '/cache-eviction-policies', icon: Table },
  { name: 'Tree Structures', path: '/tree-structures', icon: Box },
  { name: 'Searching Algorithms', path: '/searching-algorithms', icon: Search },
  { name: 'Message Queues', path: '/message-queues', icon: MessageSquare },
  { name: 'Free Space Defragmentation', path: '/free-space-defragmentation', icon: HardDrive },
  { name: 'Page Replacement', path: '/paging-algorithms', icon: List },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen sticky top-0 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white w-64 shadow-lg p-4">
      <Link to="/" className="flex items-center space-x-2 mb-8">
        <div className="w-8 h-8">
          {/* Addd Icon Here */}
          <img src={algowizLogo} alt="AlgoWiz Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-xl font-bold">AlgoWiz</h1>
      </Link>
      <div className="flex-1 overflow-y-auto">
        <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
          Algorithm Categories
        </h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                location.pathname.startsWith(item.path)
                  ? 'bg-primary-blue text-white shadow-md'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon
                className={`w-5 h-5 mr-4 ${
                  location.pathname.startsWith(item.path)
                    ? 'text-white'
                    : 'text-primary-blue dark:text-primary-blue'
                }`}
              />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;