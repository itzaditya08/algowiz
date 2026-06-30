class TreeNode {
  constructor(value, id) {
    this.id = id || Math.random().toString(36).substring(7);
    this.value = value;
    this.left = null;
    this.right = null;
    this.x = 0;
    this.y = 0;
  }
}

// 1. Build a strict Binary Search Tree
export const buildBST = (values) => {
  if (!values || values.length === 0) return null;
  const root = new TreeNode(values[0]);
  
  const insert = (node, val) => {
    if (val < node.value) {
      if (!node.left) node.left = new TreeNode(val);
      else insert(node.left, val);
    } else if (val > node.value) { 
      if (!node.right) node.right = new TreeNode(val);
      else insert(node.right, val);
    }
  };

  for (let i = 1; i < values.length; i++) insert(root, values[i]);
  return root;
};

// 2. Build a General Binary Tree (Level-Order Insertion)
export const buildGeneralBinaryTree = (values) => {
    if (!values || values.length === 0) return null;
    const root = new TreeNode(values[0]);
    const queue = [root];
    let i = 1;

    while (queue.length > 0 && i < values.length) {
        const current = queue.shift();
        
        // Left Child
        if (i < values.length) {
            current.left = new TreeNode(values[i++]);
            queue.push(current.left);
        }
        // Right Child
        if (i < values.length) {
            current.right = new TreeNode(values[i++]);
            queue.push(current.right);
        }
    }
    return root;
};

// Calculate SVG coordinates for ANY tree
export const calculateTreeLayout = (root) => {
  const nodes = [];
  const edges = [];

  const traverse = (node, depth, x, xOffset) => {
    if (!node) return;
    node.x = x;
    node.y = 10 + depth * 18; // 18% vertical gap per level
    nodes.push(node);

    if (node.left) {
      const leftX = x - xOffset;
      edges.push({ source: node.id, target: node.left.id, sx: node.x, sy: node.y, tx: leftX, ty: node.y + 18 });
      traverse(node.left, depth + 1, leftX, xOffset / 1.8); 
    }

    if (node.right) {
      const rightX = x + xOffset;
      edges.push({ source: node.id, target: node.right.id, sx: node.x, sy: node.y, tx: rightX, ty: node.y + 18 });
      traverse(node.right, depth + 1, rightX, xOffset / 1.8);
    }
  };

  if (root) traverse(root, 0, 50, 25);
  return { root, nodes, edges };
};

export const parseTreeInput = (inputStr) => {
  return inputStr.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n));
};