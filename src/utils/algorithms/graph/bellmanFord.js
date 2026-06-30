export const generateBellmanFordSteps = (graph, startNodeId) => {
  const steps = [];
  const distances = {};
  graph.nodes.forEach(n => distances[n.id] = Infinity);
  distances[startNodeId] = 0;

  steps.push({ activeNode: null, visitedNodes: [], activeEdges: [], distances: { ...distances }, message: `Initialized distances.` });

  // Relax all edges V-1 times
  for (let i = 0; i < graph.nodes.length - 1; i++) {
    steps.push({ activeNode: null, visitedNodes: [], activeEdges: [], distances: { ...distances }, message: `Iteration ${i + 1} of V-1.` });
    
    for (const edge of graph.edges) {
      // For undirected graph visualization, evaluate both directions
      const pairs = [[edge.source, edge.target], [edge.target, edge.source]];
      const edgeId = [edge.source, edge.target].sort().join('-');
      
      for (const [u, v] of pairs) {
        if (distances[u] !== Infinity && distances[u] + edge.weight < distances[v]) {
          steps.push({ activeNode: u, visitedNodes: [], activeEdges: [edgeId], distances: { ...distances }, message: `Relaxing edge ${u}-${v}.` });
          distances[v] = distances[u] + edge.weight;
          steps.push({ activeNode: v, visitedNodes: [], activeEdges: [edgeId], distances: { ...distances }, message: `Updated distance of ${v} to ${distances[v]}.` });
        }
      }
    }
  }
  return steps;
};