import React, { useState, useEffect, useCallback } from 'react';
import VisualizerLayout from '../../components/visualizer-core/VisualizerLayout';
import ControlPanel from '../../components/visualizer-core/ControlPanel';
import InfoPanel from '../../components/visualizer-core/InfoPanel';
import CanvasArea from '../../components/visualizer-core/CanvasArea';
import GraphVisualizer from '../../components/visualizers/GraphVisualizer';

// Data & Algos
import { defaultGraphData, parseCustomGraph } from '../../utils/algorithms/graph/graphData';
import { generateBFSSteps } from '../../utils/algorithms/graph/bfs';
import { generateDFSSteps } from '../../utils/algorithms/graph/dfs';
import { generateDijkstraSteps } from '../../utils/algorithms/graph/dijkstra';
import { generateBellmanFordSteps } from '../../utils/algorithms/graph/bellmanFord';
import { generateFloydWarshallSteps } from '../../utils/algorithms/graph/floydWarshall';

const GraphPage = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(60);
  const [algorithm, setAlgorithm] = useState('Dijkstra');
  
  // Custom Input State
  const [customInput, setCustomInput] = useState("A B 4\nA C 2\nB C 1\nB D 5\nC E 3\nE D 1\nD F 4\nE F 8");
  const [activeGraph, setActiveGraph] = useState(defaultGraphData);
  const [startNode, setStartNode] = useState('A');
  
  const [steps, setSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Apply custom graph input
  const applyCustomGraph = useCallback(() => {
    try {
      if (!customInput.trim()) {
        setActiveGraph(defaultGraphData);
        setStartNode(defaultGraphData.nodes[0].id);
        return;
      }
      const parsed = parseCustomGraph(customInput);
      if (parsed.nodes.length > 0) {
        setActiveGraph(parsed);
        if (!parsed.nodes.find(n => n.id === startNode)) {
          setStartNode(parsed.nodes[0].id);
        }
      }
    } catch (e) {
      console.error("Invalid graph input format");
    }
  }, [customInput, startNode]);

  // Recalculate steps when graph or algo changes
  const initVisualizer = useCallback(() => {
    setIsPlaying(false);
    let newSteps = [];
    if (algorithm === 'BFS') newSteps = generateBFSSteps(activeGraph, startNode);
    if (algorithm === 'DFS') newSteps = generateDFSSteps(activeGraph, startNode);
    if (algorithm === 'Dijkstra') newSteps = generateDijkstraSteps(activeGraph, startNode);
    if (algorithm === 'Bellman-Ford') newSteps = generateBellmanFordSteps(activeGraph, startNode);
    if (algorithm === 'Floyd-Warshall') newSteps = generateFloydWarshallSteps(activeGraph); // No start node needed
    
    setSteps(newSteps);
    setCurrentStepIndex(0);
  }, [algorithm, activeGraph, startNode]);

  // Auto-update graph when input changes
  useEffect(() => { applyCustomGraph(); }, [applyCustomGraph]);
  useEffect(() => { initVisualizer(); }, [initVisualizer]);

  // Playback timer
  useEffect(() => {
    let timer;
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timer = setTimeout(() => { setCurrentStepIndex(p => p + 1); }, 1500 - (speed * 14));
    } else if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  const frame = steps[currentStepIndex] || { activeNode: null, visitedNodes: [], activeEdges: [], distances: {}, message: "" };

  const customControls = (
    <>
      <select 
        value={algorithm} onChange={(e) => setAlgorithm(e.target.value)}
        className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-3 py-2 outline-none"
      >
        <option>BFS</option>
        <option>DFS</option>
        <option>Dijkstra</option>
        <option>Bellman-Ford</option>
        <option>Floyd-Warshall</option>
      </select>
      
      {algorithm !== 'Floyd-Warshall' && (
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium hidden sm:inline">Start:</span>
          <select 
            value={startNode} onChange={(e) => setStartNode(e.target.value)}
            className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm rounded-lg px-2 py-1 outline-none"
          >
            {activeGraph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
        </div>
      )}
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
            title={algorithm}
            description="Visualizes graph traversal and shortest path routing logic on the provided network map."
            timeComplexity={algorithm === 'Floyd-Warshall' ? "O(V³)" : "Varies (O(V+E) to O(VE))"}
            spaceComplexity="O(V²)"
            currentStepMsg={frame.message}
          />
          {/* Custom Input Box Section */}
          <div className="glass-panel rounded-2xl p-4 border border-gray-200/50 dark:border-gray-700/50 shadow-md flex-1">
            <h3 className="text-sm font-bold mb-2">Custom Graph Input</h3>
            <p className="text-xs text-gray-500 mb-2">Format: <code>Source Target Weight</code> (e.g., A B 4)</p>
            <textarea
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="w-full h-32 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-2 text-sm font-mono outline-none focus:border-primary-blue resize-none"
              placeholder="A B 4&#10;A C 2"
            />
          </div>
        </div>
      }
      canvas={
        <CanvasArea>
          <GraphVisualizer 
            graph={activeGraph}
            activeNode={frame.activeNode}
            visitedNodes={frame.visitedNodes}
            activeEdges={frame.activeEdges}
            distances={frame.distances}
          />
        </CanvasArea>
      }
    />
  );
};

export default GraphPage;