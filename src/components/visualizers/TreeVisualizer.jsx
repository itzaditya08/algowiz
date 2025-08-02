import React from 'react';
import { motion } from 'framer-motion';

const TreeVisualizer = ({ treeData, highlight, traversalPath, offsetX }) => {
    
    // Renders an individual node as a motion.div
    const renderNode = (node) => {
        const isHighlighted = highlight.includes(node.value);
        const isTraversal = traversalPath.includes(node.value);

        return (
            <motion.div
                key={node.id}
                className={`absolute flex items-center justify-center rounded-full w-12 h-12 text-lg font-bold shadow-md
                    ${isTraversal ? 'bg-purple-500 text-white animate-pulse' : (isHighlighted ? 'bg-yellow-500 text-black border-4 border-yellow-300' : 'bg-gray-700 text-white')}
                    transition-all duration-300 ease-out z-10
                `}
                style={{
                    top: node.y,
                    left: node.x + offsetX, // Apply horizontal offset here
                    transform: isHighlighted ? 'scale(1.1)' : 'scale(1)',
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
            >
                {node.value}
            </motion.div>
        );
    };

    // Renders the connecting lines between nodes using SVG
    const renderEdges = (node) => {
        const edges = [];
        const { x, y } = node;
        const parentNodeSize = 48;
        const childNodeSize = 48;
        
        // Start line from the bottom-center of the parent
        const parentLineStart = {
            x: x + (parentNodeSize / 2) + offsetX, // Apply horizontal offset here
            y: y + parentNodeSize,
        };

        if (node.left) {
            // End line at the top-center of the left child
            const childLineEnd = {
                x: node.left.x + (childNodeSize / 2) + offsetX, // Apply horizontal offset here
                y: node.left.y,
            };

            edges.push(
                <line
                    key={`${node.id}-${node.left.id}`}
                    x1={parentLineStart.x}
                    y1={parentLineStart.y}
                    x2={childLineEnd.x}
                    y2={childLineEnd.y}
                    className="stroke-current text-gray-500 dark:text-gray-400"
                    strokeWidth="2"
                />
            );
            edges.push(...renderEdges(node.left));
        }

        if (node.right) {
            // End line at the top-center of the right child
            const childLineEnd = {
                x: node.right.x + (childNodeSize / 2) + offsetX, // Apply horizontal offset here
                y: node.right.y,
            };

            edges.push(
                <line
                    key={`${node.id}-${node.right.id}`}
                    x1={parentLineStart.x}
                    y1={parentLineStart.y}
                    x2={childLineEnd.x}
                    y2={childLineEnd.y}
                    className="stroke-current text-gray-500 dark:text-gray-400"
                    strokeWidth="2"
                />
            );
            edges.push(...renderEdges(node.right));
        }

        return edges;
    };

    return (
        // Remove the transform style from the main container
        <div className="relative w-full h-full">
            {/* SVG for drawing edges */}
            <svg className="absolute w-full h-full pointer-events-none z-0">
                {treeData && treeData.root && renderEdges(treeData.root)}
            </svg>
            
            {/* Div for rendering nodes */}
            <div className="relative w-full h-full">
                {treeData && treeData.root && treeData.allNodes.map(node => renderNode(node))}
            </div>
        </div>
    );
};

export default TreeVisualizer;