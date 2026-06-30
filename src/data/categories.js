import { GitGraph, Cpu, UnfoldHorizontal, Table, Box, Search, MessageSquare, HardDrive, List } from 'lucide-react';

export const categories = [
  {
    title: 'Graph Algorithms',
    description: 'Visualize graph traversal and shortest path algorithms.',
    path: '/graph-algorithms',
    icon: GitGraph,
    algos: ['BFS', 'DFS', 'Dijkstra', 'Bellman-Ford', 'Floyd-Warshall'],
  },
  {
    title: 'OS Scheduling',
    description: 'Visualize CPU scheduling algorithms like FCFS, SJF, Priority, and Round Robin.',
    path: '/os-scheduling-algorithms',
    icon: Cpu,
    algos: ['FCFS', 'SJF', 'Priority', 'RR'],
  },
  {
    title: 'Sorting Algorithms',
    description: 'Watch sorting algorithms in action with step-by-step visualization.',
    path: '/sorting-algorithms',
    icon: UnfoldHorizontal,
    algos: ['Bubble', 'Quick', 'Merge', 'Heap'],
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
    algos: ['Linear', 'Binary', 'Expotential Binary'],
  },
  {
    title: 'Message Queues',
    description: 'Visualize queue data structures and their behavior.',
    path: '/message-queues',
    icon: MessageSquare,
    algos: ['Producer-Consumer', 'Pub-Sub', 'Req-Reply', 'Competing Consumers'],
  },
  {
    title: 'Defragmentation',
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
    algos: ['FIFO', 'LRU', 'Optimal'],
  },
];