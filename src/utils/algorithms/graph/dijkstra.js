import { createAdjacencyList } from './graphData';

export const generateDijkstraSteps = (graph, startNodeId) => {
  const steps = [];
  const adjList = createAdjacencyList(graph.nodes, graph.edges);
  const distances = {};
  const visited = new Set();
  
  graph.nodes.forEach(n => distances[n.id] = Infinity);
  distances[startNodeId] = 0;

  steps.push({ activeNode: null, visitedNodes: [], activeEdges: [], distances: { ...distances }, message: `Initialized distances.` });

  while (visited.size < graph.nodes.length) {
    let minNode = null, minDistance = Infinity;
    for (const nodeId in distances) {
      if (!visited.has(nodeId) && distances[nodeId] <= minDistance) {
        minDistance = distances[nodeId];
        minNode = nodeId;
      }
    }

    if (minNode === null || minDistance === Infinity) break;
    visited.add(minNode);
    steps.push({ activeNode: minNode, visitedNodes: Array.from(visited), activeEdges: [], distances: { ...distances }, message: `Visiting ${minNode}.` });

    for (const neighbor of adjList[minNode]) {
      if (visited.has(neighbor.node)) continue;
      const newDist = distances[minNode] + neighbor.weight;
      const edgeId = [minNode, neighbor.node].sort().join('-');

      steps.push({ activeNode: minNode, visitedNodes: Array.from(visited), activeEdges: [edgeId], distances: { ...distances }, message: `Checking edge ${minNode}-${neighbor.node}.` });

      if (newDist < distances[neighbor.node]) {
        distances[neighbor.node] = newDist;
        steps.push({ activeNode: neighbor.node, visitedNodes: Array.from(visited), activeEdges: [edgeId], distances: { ...distances }, message: `Updated distance of ${neighbor.node} to ${newDist}.` });
      }
    }
  }
  return steps;
};