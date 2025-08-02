import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const GraphVisualizer = ({ graphData, isDirected, isWeighted }) => {
    const containerRef = useRef(null);
    const [positionedNodes, setPositionedNodes] = useState([]);

    const NODE_SIZE = 48;
    const NODE_RADIUS = NODE_SIZE / 2;

    useEffect(() => {
        if (containerRef.current && graphData && graphData.nodes) {
            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;
            const nodes = graphData.nodes;
            const numNodes = nodes.length;

            if (numNodes === 0) {
                setPositionedNodes([]);
                return;
            }

            // Check if nodes already have positions, if so, use them
            if (nodes[0] && nodes[0].x !== undefined && nodes[0].y !== undefined) {
                 setPositionedNodes(nodes);
                 return;
            }

            // Calculate positions if they don't exist, arranging them in a circle
            const centerX = containerWidth / 2;
            const centerY = containerHeight / 2;
            const radius = Math.min(containerWidth, containerHeight) / 2 * 0.8;

            const newPositionedNodes = nodes.map((node, index) => {
                const angle = (index / numNodes) * 2 * Math.PI;
                return {
                    ...node,
                    x: centerX + radius * Math.cos(angle) - NODE_RADIUS,
                    y: centerY + radius * Math.sin(angle) - NODE_RADIUS,
                };
            });
            setPositionedNodes(newPositionedNodes);
        }
    }, [graphData, graphData.nodes]);


    if (!graphData || !graphData.nodes || graphData.nodes.length === 0) {
        return (
            <div ref={containerRef} className="flex items-center justify-center h-full">
                <p className="text-center text-slate-500">
                    Add nodes and edges to begin visualizing.
                </p>
            </div>
        );
    }

    const edges = graphData.edges || [];

    return (
        <div ref={containerRef} className="relative w-full h-full">
            <svg className="absolute w-full h-full pointer-events-none z-0" overflow="visible">
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" className="fill-current text-slate-500" />
                    </marker>
                    <marker id="arrowhead-highlight" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" className="fill-current text-amber-500" />
                    </marker>
                </defs>
                {edges.map((edge, index) => {
                    const fromNode = positionedNodes.find(n => n.id === edge.from);
                    const toNode = positionedNodes.find(n => n.id === edge.to);

                    if (!fromNode || !toNode) return null;

                    const startX = fromNode.x + NODE_RADIUS;
                    const startY = fromNode.y + NODE_RADIUS;
                    const endX = toNode.x + NODE_RADIUS;
                    const endY = toNode.y + NODE_RADIUS;

                    const dx = endX - startX;
                    const dy = endY - startY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist === 0) return null;

                    const offset = NODE_RADIUS + (isDirected ? 2 : 0);
                    const adjustedEndX = endX - (dx / dist) * offset;
                    const adjustedEndY = endY - (dy / dist) * offset;

                    const isHighlighted = edge.isHighlighted;

                    return (
                        <g key={index}>
                            <line
                                x1={startX}
                                y1={startY}
                                x2={adjustedEndX}
                                y2={adjustedEndY}
                                className={`stroke-current transition-all duration-300 ${isHighlighted ? 'text-amber-500' : 'text-slate-600 dark:text-slate-500'}`}
                                strokeWidth={isHighlighted ? "3" : "1.5"}
                                markerEnd={isDirected ? (isHighlighted ? "url(#arrowhead-highlight)" : "url(#arrowhead)") : ""}
                            />
                            {isWeighted && (
                                <text
                                    x={(startX + adjustedEndX) / 2}
                                    y={(startY + adjustedEndY) / 2 - 10}
                                    textAnchor="middle"
                                    className={`fill-current text-sm font-semibold pointer-events-auto ${isHighlighted ? 'text-amber-400' : 'text-slate-400'}`}
                                >
                                    {edge.weight}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>

            {positionedNodes.map(node => (
                <motion.div
                    key={node.id}
                    className={`absolute flex items-center justify-center rounded-full text-lg font-bold shadow-lg
                        w-12 h-12 border-2
                        ${node.state === 'visited' ? 'bg-emerald-500 text-white border-emerald-400' : 
                          node.state === 'active' ? 'bg-amber-500 text-black border-amber-300 ring-4 ring-amber-500/30' : 
                          'bg-slate-700 text-white border-slate-500'}
                        transition-all duration-300 ease-out z-10`}
                    style={{
                        left: node.x,
                        top: node.y,
                        transform: node.isHighlighted ? 'scale(1.1)' : 'scale(1)',
                    }}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    {node.id}
                </motion.div>
            ))}
        </div>
    );
};

export default GraphVisualizer;
