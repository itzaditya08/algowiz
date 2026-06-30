import React from 'react';
import { motion } from 'framer-motion';

const GraphVisualizer = ({ graph, activeNode, visitedNodes = [], activeEdges = [], distances = {} }) => {
  
  const getEdgeStyle = (source, target) => {
    const edgeId = [source, target].sort().join('-');
    if (activeEdges.includes(edgeId)) return { stroke: '#3b82f6', strokeWidth: 4, opacity: 1, zIndex: 10 }; 
    return { stroke: '#94a3b8', strokeWidth: 2, opacity: 0.3, zIndex: 0 }; 
  };

  return (
    <div className="relative w-full h-full min-h-[500px] bg-white/50 dark:bg-gray-900/50 rounded-2xl overflow-hidden">
      
      {/* SVG Layer for Edges */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {graph.edges.map((edge, idx) => {
          const sourceNode = graph.nodes.find(n => n.id === edge.source);
          const targetNode = graph.nodes.find(n => n.id === edge.target);
          if (!sourceNode || !targetNode) return null; // Safe guard for custom input
          const style = getEdgeStyle(edge.source, edge.target);

          return (
            <g key={idx}>
              <line
                x1={`${sourceNode.x}%`} y1={`${sourceNode.y}%`}
                x2={`${targetNode.x}%`} y2={`${targetNode.y}%`}
                stroke={style.stroke} strokeWidth={style.strokeWidth} opacity={style.opacity}
                className="transition-all duration-300 ease-in-out"
              />
              <circle cx={`${(sourceNode.x + targetNode.x) / 2}%`} cy={`${(sourceNode.y + targetNode.y) / 2}%`} r="12" fill="#1e293b" opacity="0.8" />
              <text
                x={`${(sourceNode.x + targetNode.x) / 2}%`} y={`${(sourceNode.y + targetNode.y) / 2}%`}
                fill="white" fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="central"
              >
                {edge.weight}
              </text>
            </g>
          );
        })}
      </svg>

      {/* HTML Layer for Nodes */}
      {graph.nodes.map((node) => {
        const isVisited = visitedNodes.includes(node.id);
        const isActive = activeNode === node.id;
        const currentDist = distances[node.id];

        let bgColor = 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600';
        if (isVisited) bgColor = 'bg-emerald-500 text-white border-emerald-600';
        if (isActive) bgColor = 'bg-yellow-400 text-gray-900 border-yellow-500 shadow-[0_0_20px_rgba(250,204,21,0.6)]';

        return (
          <motion.div
            key={node.id}
            initial={false}
            animate={{ scale: isActive ? 1.2 : 1 }}
            className={`absolute w-12 h-12 -ml-6 -mt-6 rounded-full flex items-center justify-center border-4 font-bold text-lg z-20 transition-colors duration-300 ${bgColor}`}
            style={{ left: `${node.x}%`, top: `${node.y}%` }}
          >
            {node.id}
            {currentDist !== undefined && (
              <div className="absolute -top-8 bg-gray-900 dark:bg-black text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
                {currentDist === Infinity ? '∞' : currentDist}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default GraphVisualizer;