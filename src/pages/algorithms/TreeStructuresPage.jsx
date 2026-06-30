import React, { useState, useEffect, useCallback } from 'react';
import VisualizerLayout from '../../components/visualizer-core/VisualizerLayout';
import ControlPanel from '../../components/visualizer-core/ControlPanel';
import InfoPanel from '../../components/visualizer-core/InfoPanel';
import CanvasArea from '../../components/visualizer-core/CanvasArea';
import TreeVisualizer from '../../components/visualizers/TreeVisualizer'; // Use the modular visualizer we built earlier

import { buildBST, buildGeneralBinaryTree, calculateTreeLayout, parseTreeInput } from '../../utils/algorithms/tree/treeBuilder';
import { generateInOrderSteps, generatePreOrderSteps, generatePostOrderSteps } from '../../utils/algorithms/tree/traversals';

const defaultInput = "50, 30, 70, 20, 40, 60, 80";

const TreeStructuresPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(60);
  const [traversalType, setTraversalType] = useState('In-Order');
  const [treeType, setTreeType] = useState('Binary Search Tree'); // BT or BST
  
  const [customInput, setCustomInput] = useState(defaultInput);
  const [treeLayout, setTreeLayout] = useState({ root: null, nodes: [], edges: [] });
  
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const applyCustomTree = useCallback(() => {
    try {
      const values = parseTreeInput(customInput);
      const dataToUse = values.length > 0 ? values : parseTreeInput(defaultInput);
      
      // Select Builder based on State
      const root = treeType === 'Binary Search Tree' 
            ? buildBST(dataToUse) 
            : buildGeneralBinaryTree(dataToUse);
            
      setTreeLayout(calculateTreeLayout(root));
    } catch (e) {
      console.error("Invalid tree input");
    }
  }, [customInput, treeType]);

  const initVisualizer = useCallback(() => {
    setIsPlaying(false);
    if (!treeLayout.root) return;

    let newSteps = [];
    if (traversalType === 'In-Order') newSteps = generateInOrderSteps(treeLayout.root);
    if (traversalType === 'Pre-Order') newSteps = generatePreOrderSteps(treeLayout.root);
    if (traversalType === 'Post-Order') newSteps = generatePostOrderSteps(treeLayout.root);
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
  }, [traversalType, treeLayout]);

  useEffect(() => { applyCustomTree(); }, [applyCustomTree]);
  useEffect(() => { initVisualizer(); }, [initVisualizer]);

  useEffect(() => {
    let timer;
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timer = setTimeout(() => { setCurrentStepIndex(p => p + 1); }, 1300 - (speed * 12));
    } else if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const frame = steps[currentStepIndex] || { activeNode: null, visitedNodes: [], traversalResult: [], message: "Ready to Start." };

  const customControls = (
      <>
        <select 
          value={treeType} onChange={(e) => setTreeType(e.target.value)}
          className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none"
        >
          <option>Binary Search Tree</option>
          <option>General Binary Tree</option>
        </select>
        <select 
          value={traversalType} onChange={(e) => setTraversalType(e.target.value)}
          className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none"
        >
          <option>In-Order</option>
          <option>Pre-Order</option>
          <option>Post-Order</option>
        </select>
      </>
  );

  return (
    <VisualizerLayout 
      controls={
        <ControlPanel 
          isPlaying={isPlaying} onPlayPause={() => setIsPlaying(!isPlaying)}
          onReset={initVisualizer}
          onStep={() => { setIsPlaying(false); if (currentStepIndex < steps.length - 1) setCurrentStepIndex(p => p + 1); }}
          speed={speed} onSpeedChange={setSpeed}
        >
          {customControls}
        </ControlPanel>
      }
      info={
        <div className="flex flex-col gap-4 h-full">
          <InfoPanel 
            title={treeType}
            description={treeType === 'Binary Search Tree' 
                ? "Nodes are arranged where left children are strictly lesser and right children strictly greater than parents." 
                : "A hierarchical structure where nodes are inserted level-by-level without strict value constraints."}
            timeComplexity="O(N) to traverse"
            spaceComplexity="O(H) via Call Stack"
            currentStepMsg={frame.message}
          />
          
          <div className="glass-panel rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-md flex-1">
            <h3 className="text-sm font-bold mb-1">Insert Nodes</h3>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full h-16 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm font-mono outline-none focus:border-primary-blue resize-none"
            />
          </div>
        </div>
      }
      canvas={
        <CanvasArea>
          <TreeVisualizer 
            nodes={treeLayout.nodes} edges={treeLayout.edges}
            activeNode={frame.activeNode} visitedNodes={frame.visitedNodes} traversalResult={frame.traversalResult}
          />
        </CanvasArea>
      }
    />
  );
};

export default TreeStructuresPage;