import { createAdjacencyList } from './graphData';

export const generateDFSSteps = (graph, startNodeId) => {
  const steps = [];
  const adjList = createAdjacencyList(graph.nodes, graph.edges);
  const visited = new Set();
  const activeEdges = [];

  const dfs = (current, parentEdge) => {
    visited.add(current);
    if (parentEdge) activeEdges.push(parentEdge);
    
    steps.push({ activeNode: current, visitedNodes: Array.from(visited), activeEdges: [...activeEdges], distances: {}, message: `Visited ${current}.` });

    for (const neighbor of adjList[current]) {
      const edgeId = [current, neighbor.node].sort().join('-');
      
      if (!visited.has(neighbor.node)) {
        steps.push({ activeNode: current, visitedNodes: Array.from(visited), activeEdges: [edgeId], distances: {}, message: `Going deep into ${neighbor.node}.` });
        dfs(neighbor.node, edgeId);
        steps.push({ activeNode: current, visitedNodes: Array.from(visited), activeEdges: [...activeEdges], distances: {}, message: `Backtracked to ${current}.` });
      }
    }
  };

  steps.push({ activeNode: null, visitedNodes: [], activeEdges: [], distances: {}, message: `Start DFS from ${startNodeId}.` });
  dfs(startNodeId, null);
  return steps;
};