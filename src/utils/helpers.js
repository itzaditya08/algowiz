import {
  GitGraph, Cpu, UnfoldHorizontal, Table, Box, Search, MessageSquare, HardDrive, List,
} from 'lucide-react';

export const getTitleAndDescription = (pathname) => {
    switch (pathname) {
      case '/graph-algorithms':
        return {
          title: 'Graph Algorithms',
          description: 'Visualize common graph algorithms like traversal, shortest path, and minimum spanning tree.',
          subcategories: [
            { id: 'DFS', name: 'Depth-First Search', description: 'Traverses a graph in a depthward motion, using a stack to remember the next vertex to visit.' },
            { id: 'BFS', name: 'Breadth-First Search', description: 'Traverses a graph in a breadthward motion, exploring all neighbors at the present depth prior to moving on to the nodes at the next depth level.' },
            { id: 'Dijkstra', name: 'Dijkstra\'s Algorithm', description: 'Finds the shortest paths from a single source node to all other nodes in a non-negative weighted graph.' },
            { id: 'BellmanFord', name: 'Bellman-Ford Algorithm', description: 'Finds the shortest paths from a single source node to all other nodes in a weighted graph, even with negative edge weights.' },
            { id: 'Floyd', name: 'Floyd-Warshall Algorithm', description: 'Finds the shortest paths between all pairs of vertices in a weighted graph.' },
            { id: 'Prims', name: 'Prim\'s Algorithm', description: 'Finds a minimum spanning tree for a weighted undirected graph.' },
            { id: 'Kruskals', name: 'Kruskal\'s Algorithm', description: 'Finds a minimum spanning tree for a connected weighted graph by picking edges with the smallest weights first.' },
          ],
        };
      case '/os-scheduling-algorithms':
        return {
          title: 'OS Scheduling Algorithms',
          description: 'Visualize CPU scheduling algorithms like FCFS, SJF, Priority, and Round Robin.',
          subcategories: [
              { id: 'FCFS', name: 'First-Come, First-Served' },
              { id: 'SJF_NP', name: 'Non-Preemptive SJF' },
              { id: 'SJF_P', name: 'Preemptive SJF' },
              { id: 'Priority_NP', name: 'Non-Preemptive Priority' },
              { id: 'Priority_P', name: 'Preemptive Priority' },
              { id: 'RoundRobin', name: 'Round Robin' },
          ]
        };
      case '/sorting-algorithms':
        return {
          title: 'Sorting Algorithms',
          description: 'Watch sorting algorithms in action with step-by-step visualization.',
        };
      case '/cache-eviction-policies':
        return {
          title: 'Cache Eviction Policies',
          description: 'Explore cache eviction policies like LRU, FIFO, and LFU.',
        };
      case '/tree-structures':
        return {
          title: 'Tree Structures',
          description: 'Understand diagrammatic representation of various tree data structures.',
        };
      case '/searching-algorithms':
        return {
          title: 'Searching Algorithms',
          description: 'See searching algorithms in action, including Binary Search and Linear Search.',
        };
      case '/message-queues':
        return {
          title: 'Message Queues',
          description: 'Visualize queue data structures and their behavior.',
        };
      case '/free-space-defragmentation':
        return {
          title: 'Free Space Defragmentation Technique',
          description: 'Understand how memory is managed with First Fit, Next Fit, Best Fit, and Worst Fit.',
        };
      case '/paging-algorithms':
        return {
          title: 'Paging Algorithms',
          description: 'Learn about virtual memory management with FIFO, Optimal, and LRU paging.',
        };
      default:
        return {
          title: 'Algorithm Visualizer',
          description: 'Visualize and compare different algorithms through interactive visualizations.',
        };
    }
};

export const getCategoryIcon = (pathname) => {
  switch (pathname) {
    case '/graph-algorithms':
      return GitGraph;
    case '/os-scheduling-algorithms':
      return Cpu;
    case '/sorting-algorithms':
      return UnfoldHorizontal;
    case '/cache-eviction-policies':
      return Table;
    case '/tree-structures':
      return Box;
    case '/searching-algorithms':
      return Search;
    case '/message-queues':
      return MessageSquare;
    case '/free-space-defragmentation':
      return HardDrive;
    case '/paging-algorithms':
      return List;
    default:
      return null;
  }
};

export const getProcessColor = (processId) => {
    const colors = {
        'P1': 'bg-green-500',
        'P2': 'bg-blue-500',
        'P3': 'bg-purple-500',
        'P4': 'bg-yellow-500',
        'P5': 'bg-red-500',
        'P6': 'bg-indigo-500',
        'P7': 'bg-pink-500',
        'P8': 'bg-teal-500',
    };
    return colors[processId] || 'bg-gray-500';
};

export const getGraphNodeColor = (nodeId) => {
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50'];
    const index = nodeId.charCodeAt(0) % colors.length;
    return colors[index];
};
