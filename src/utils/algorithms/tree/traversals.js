// Base generator function to handle the standard step formatting
const createTraversalSteps = (root, traversalType, algorithm) => {
  const steps = [];
  const visited = [];

  steps.push({
    activeNode: null, visitedNodes: [], traversalResult: [],
    message: `Initialized ${traversalType} Traversal. Preparing to start at root.`
  });

  const traverse = (node) => {
    if (!node) return;
    
    // Visit Step (Checking node)
    steps.push({
      activeNode: node.id, visitedNodes: [...visited], traversalResult: [...visited],
      message: `Visiting Node ${node.value}...`
    });

    algorithm(node, traverse, visited, steps);
  };

  traverse(root);

  steps.push({
    activeNode: null, visitedNodes: [...visited], traversalResult: [...visited],
    message: `${traversalType} Traversal Complete! Result: [${visited.join(', ')}]`
  });

  return steps;
};

// 1. In-Order (Left, Root, Right)
export const generateInOrderSteps = (root) => {
  return createTraversalSteps(root, 'In-Order', (node, traverse, visited, steps) => {
    if (node.left) {
      steps.push({ activeNode: node.id, visitedNodes: [...visited], traversalResult: [...visited], message: `Moving left from ${node.value}...` });
      traverse(node.left);
    }
    
    // Process Root
    visited.push(node.value);
    steps.push({ activeNode: node.id, visitedNodes: [...visited], traversalResult: [...visited], message: `Processed ${node.value}. Adding to result.` });

    if (node.right) {
      steps.push({ activeNode: node.id, visitedNodes: [...visited], traversalResult: [...visited], message: `Moving right from ${node.value}...` });
      traverse(node.right);
    }
  });
};

// 2. Pre-Order (Root, Left, Right)
export const generatePreOrderSteps = (root) => {
  return createTraversalSteps(root, 'Pre-Order', (node, traverse, visited, steps) => {
    // Process Root
    visited.push(node.value);
    steps.push({ activeNode: node.id, visitedNodes: [...visited], traversalResult: [...visited], message: `Processed ${node.value}. Adding to result.` });

    if (node.left) {
      steps.push({ activeNode: node.id, visitedNodes: [...visited], traversalResult: [...visited], message: `Moving left from ${node.value}...` });
      traverse(node.left);
    }
    if (node.right) {
      steps.push({ activeNode: node.id, visitedNodes: [...visited], traversalResult: [...visited], message: `Moving right from ${node.value}...` });
      traverse(node.right);
    }
  });
};

// 3. Post-Order (Left, Right, Root)
export const generatePostOrderSteps = (root) => {
  return createTraversalSteps(root, 'Post-Order', (node, traverse, visited, steps) => {
    if (node.left) {
      steps.push({ activeNode: node.id, visitedNodes: [...visited], traversalResult: [...visited], message: `Moving left from ${node.value}...` });
      traverse(node.left);
    }
    if (node.right) {
      steps.push({ activeNode: node.id, visitedNodes: [...visited], traversalResult: [...visited], message: `Moving right from ${node.value}...` });
      traverse(node.right);
    }
    
    // Process Root
    visited.push(node.value);
    steps.push({ activeNode: node.id, visitedNodes: [...visited], traversalResult: [...visited], message: `Processed ${node.value}. Adding to result.` });
  });
};