import React from 'react';
import { Link } from 'react-router-dom';
import {
  GitGraph, Cpu, UnfoldHorizontal, Table, Box, Search, MessageSquare, HardDrive, List, ArrowRight,
} from 'lucide-react';

const categories = [
  {
    title: 'Graph Algorithms',
    description: 'Visualize graph traversal and shortest path algorithms.',
    path: '/graph-algorithms',
    icon: GitGraph,
    algos: ['DFS', 'BFS', 'Dijkstra', 'Bellman-Ford'],
  },
  {
    title: 'OS Scheduling',
    description: 'Visualize CPU scheduling algorithms like FCFS, SJF, Priority, and Round Robin.',
    path: '/os-scheduling-algorithms',
    icon: Cpu,
    algos: ['FCFS', 'SJF', 'Priority', 'Round Robin'],
  },
  {
    title: 'Sorting Algorithms',
    description: 'Watch sorting algorithms in action with step-by-step visualization.',
    path: '/sorting-algorithms',
    icon: UnfoldHorizontal,
    algos: ['Bubble Sort', 'Quick Sort', 'Merge Sort', 'Heap Sort'],
  },
  {
    title: 'Tree Structures',
    description: 'Understand tree data structures and their operations.',
    path: '/tree-structures',
    icon: Box,
    algos: ['Binary Tree', 'BST'],
  },
  {
    title: 'Cache Eviction',
    description: 'Explore cache eviction policies like LRU, FIFO, and LFU.',
    path: '/cache-eviction-policies',
    icon: Table,
    algos: ['LRU', 'FIFO', 'LFU'],
  },
  {
    title: 'Searching Algorithms',
    description: 'See searching algorithms in action, including Binary Search and Linear Search.',
    path: '/searching-algorithms',
    icon: Search,
    algos: ['Linear Search', 'Binary Search', 'Interpolation Search'],
  },
  {
    title: 'Message Queues',
    description: 'Visualize queue data structures and their behavior.',
    path: '/message-queues',
    icon: MessageSquare,
    algos: ['Producer Consumer', 'Pub Sub'],
  },
  {
    title: 'Free Space Defragmentation',
    description: 'Understand how memory is managed with First Fit, Best Fit, and Worst Fit.',
    path: '/free-space-defragmentation',
    icon: HardDrive,
    algos: ['First Fit', 'Next Fit', 'Best Fit', 'Worst Fit'],
  },
  {
    title: 'Paging Algorithms',
    description: 'Learn about virtual memory management with FIFO, Optimal, and LRU paging.',
    path: '/paging-algorithms',
    icon: List,
    algos: ['FIFO', 'Optimal', 'LRU'],
  },
];

const HomePage = () => {
  return (
    <div className="flex flex-col space-y-8">
      <div className="text-center p-12 bg-gray-100 dark:bg-gray-800 rounded-lg shadow-md">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4">AlgoWiz-Algorithm Visualizer</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Visualize and compare different algorithms including CPU scheduling, graph algorithms, sorting, trees, and more through interactive visualizations.
        </p>
        <div className="flex justify-center space-x-4">
          <Link
            to="/graph-algorithms"
            className="flex items-center px-6 py-3 bg-primary-blue text-white rounded-full font-semibold shadow-lg hover:bg-blue-600 transition-colors"
          >
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Explore Algorithm Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <div
              key={category.title}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-full bg-primary-blue/10 dark:bg-primary-blue/20">
                    <category.icon className="w-6 h-6 text-primary-blue" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{category.title}</h3>
                </div>
                <Link to={category.path}>
                  <ArrowRight className="w-6 h-6 text-gray-400 hover:text-primary-blue transition-colors" />
                </Link>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {category.algos.map((algo) => (
                  <span
                    key={algo}
                    className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full"
                  >
                    {algo}
                  </span>
                ))}
              </div>
              <Link
                to={category.path}
                className="text-primary-blue font-semibold text-sm hover:underline"
              >
                Explore {category.title}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;