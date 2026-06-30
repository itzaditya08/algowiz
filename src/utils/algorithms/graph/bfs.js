import { createAdjacencyList } from './graphData';

export const generateBFSSteps = (graph, startNodeId) => {
  const steps = [];
  const adjList = createAdjacencyList(graph.nodes, graph.edges);
  const visited = new Set([startNodeId]);
  const queue = [startNodeId];
  const activeEdges = [];

  steps.push({ activeNode: null, visitedNodes: Array.from(visited), activeEdges: [], distances: {}, message: `Start BFS from ${startNodeId}.` });

  while (queue.length > 0) {
    const current = queue.shift();
    steps.push({ activeNode: current, visitedNodes: Array.from(visited), activeEdges: [...activeEdges], distances: {}, message: `Dequeued ${current}.` });

    for (const neighbor of adjList[current]) {
      const edgeId = [current, neighbor.node].sort().join('-');
      steps.push({ activeNode: current, visitedNodes: Array.from(visited), activeEdges: [edgeId], distances: {}, message: `Checking neighbor ${neighbor.node}...` });

      if (!visited.has(neighbor.node)) {
        visited.add(neighbor.node);
        queue.push(neighbor.node);
        activeEdges.push(edgeId);
        steps.push({ activeNode: neighbor.node, visitedNodes: Array.from(visited), activeEdges: [...activeEdges], distances: {}, message: `Marked ${neighbor.node} visited.` });
      }
    }
  }
  return steps;
};