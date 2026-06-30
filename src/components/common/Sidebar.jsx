import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  { name: 'Searching', path: '/searching-algorithms', icon: Search },
  { name: 'Message Queues', path: '/message-queues', icon: MessageSquare },
  { name: 'Defragmentation', path: '/free-space-defragmentation', icon: HardDrive },
  { name: 'Page Replacement', path: '/paging-algorithms', icon: List },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    // <div className="flex flex-col h-screen sticky top-0 w-72 glass-panel border-r border-gray-200/50 dark:border-dark-border z-20">
    <div className="flex flex-col h-screen sticky top-0 w-72 bg-white/80 dark:bg-[#0B1121]/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-800/80 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-[4px_0_24px_rgba(0,0,0,0.4)]">      
      {/* Brand Header */}
      <Link to="/" className="flex items-center space-x-3 p-6 mb-2 group">
        <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 shadow-md p-1 border border-gray-100 dark:border-gray-700 flex items-center justify-center overflow-hidden transition-transform group-hover:scale-105">
          <img src={algowizLogo} alt="AlgoWiz Logo" className="w-full h-full object-contain" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
          AlgoWiz
        </h1>
      </Link>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 custom-scrollbar pb-6">
        <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-4 uppercase tracking-widest ml-2">
          Visualizers
        </h2>
        
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            
            return (
              <Link key={item.name} to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-primary-blue to-primary-blue-hover text-white shadow-lg shadow-primary-blue/30'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <item.icon
                    strokeWidth={isActive ? 2.5 : 2}
                    className={`w-5 h-5 mr-3 transition-colors ${
                      isActive ? 'text-white' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  />
                  <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.name}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;