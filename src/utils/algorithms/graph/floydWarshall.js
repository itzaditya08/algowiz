export const generateFloydWarshallSteps = (graph) => {
  const steps = [];
  const dist = {};
  const nodes = graph.nodes.map(n => n.id);

  // Initialize Distance Matrix
  nodes.forEach(u => {
    dist[u] = {};
    nodes.forEach(v => {
      dist[u][v] = u === v ? 0 : Infinity;
    });
  });

  graph.edges.forEach(edge => {
    dist[edge.source][edge.target] = edge.weight;
    dist[edge.target][edge.source] = edge.weight; // Undirected
  });

  steps.push({ activeNode: null, visitedNodes: [], activeEdges: [], distances: {}, message: `Initialized Adjacency Matrix.` });

  // Algorithm: Pick k, then update all pairs (i, j)
  for (const k of nodes) {
    for (const i of nodes) {
      for (const j of nodes) {
        if (dist[i][k] !== Infinity && dist[k][j] !== Infinity && dist[i][k] + dist[k][j] < dist[i][j]) {
          
          const edge1 = [i, k].sort().join('-');
          const edge2 = [k, j].sort().join('-');
          
          steps.push({ 
            activeNode: k, // Highlight intermediate node
            visitedNodes: [i, j], // Highlight source and dest
            activeEdges: [edge1, edge2], 
            distances: {}, // We omit the full matrix from UI distances for canvas clarity
            message: `Via ${k}: Path ${i}->${j} improved to ${dist[i][k] + dist[k][j]}`
          });
          
          dist[i][j] = dist[i][k] + dist[k][j];
        }
      }
    }
  }
  return steps;
};