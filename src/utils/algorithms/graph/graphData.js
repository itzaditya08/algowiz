export const defaultGraphData = {
  nodes: [
    { id: 'A', x: 20, y: 50 }, { id: 'B', x: 40, y: 20 },
    { id: 'C', x: 40, y: 80 }, { id: 'D', x: 70, y: 20 },
    { id: 'E', x: 70, y: 80 }, { id: 'F', x: 90, y: 50 },
  ],
  edges: [
    { source: 'A', target: 'B', weight: 4 }, { source: 'A', target: 'C', weight: 2 },
    { source: 'B', target: 'C', weight: 1 }, { source: 'B', target: 'D', weight: 5 },
    { source: 'C', target: 'E', weight: 3 }, { source: 'E', target: 'D', weight: 1 },
    { source: 'D', target: 'F', weight: 4 }, { source: 'E', target: 'F', weight: 8 },
  ]
};

// Parses a multiline string (e.g., "A B 4\nB C 2") into nodes and edges
export const parseCustomGraph = (inputStr) => {
  const edges = [];
  const uniqueNodes = new Set();
  
  const lines = inputStr.trim().split('\n');
  for (const line of lines) {
    const parts = line.trim().split(/\s+/);
    if (parts.length >= 2) {
      const source = parts[0];
      const target = parts[1];
      const weight = parts.length === 3 ? parseInt(parts[2], 10) : 1;
      
      uniqueNodes.add(source);
      uniqueNodes.add(target);
      edges.push({ source, target, weight });
    }
  }

  // Arrange nodes in a circle dynamically
  const nodes = [];
  const nodeArr = Array.from(uniqueNodes).sort();
  const radius = 35; 
  const centerX = 50; 
  const centerY = 50;

  nodeArr.forEach((id, index) => {
    const angle = (index / nodeArr.length) * 2 * Math.PI - Math.PI / 2;
    nodes.push({
      id,
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    });
  });

  return { nodes, edges };
};

export const createAdjacencyList = (nodes, edges, directed = false) => {
  const adjList = {};
  nodes.forEach(n => adjList[n.id] = []);
  edges.forEach(edge => {
    adjList[edge.source].push({ node: edge.target, weight: edge.weight });
    if (!directed) adjList[edge.target].push({ node: edge.source, weight: edge.weight });
  });
  return adjList;
};