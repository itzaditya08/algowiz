class Node {
    constructor(value, id) {
        this.id = id;
        this.value = value;
        this.left = null;
        this.right = null;
        this.x = 0;
        this.y = 0;
    }
}

export class BST {
    constructor() {
        this.root = null;
        this.nodeIdCounter = 0;
        this.comparisons = 0;
        this.traversals = {
            inOrder: () => this.inOrderTraversal(this.root, []),
            preOrder: () => this.preOrderTraversal(this.root, []),
            postOrder: () => this.postOrderTraversal(this.root, [])
        };
    }

    insert(value) {
        let details = '';
        const newNode = new Node(value, this.nodeIdCounter++);
        if (this.root === null) {
            this.root = newNode;
            details = `Inserted ${value} as the root.`;
            return { newTree: this, details, result: 'Success' };
        } else {
            let currentNode = this.root;
            details = `Searching for insertion point for ${value}... `;
            while (true) {
                if (value < currentNode.value) {
                    details += `Value ${value} is less than ${currentNode.value}. Going left. `;
                    if (currentNode.left === null) {
                        currentNode.left = newNode;
                        details += `Inserted ${value} as the left child of ${currentNode.value}.`;
                        return { newTree: this, details, result: 'Success' };
                    }
                    currentNode = currentNode.left;
                } else {
                    details += `Value ${value} is greater than ${currentNode.value}. Going right. `;
                    if (currentNode.right === null) {
                        currentNode.right = newNode;
                        details += `Inserted ${value} as the right child of ${currentNode.value}.`;
                        return { newTree: this, details, result: 'Success' };
                    }
                    currentNode = currentNode.right;
                }
            }
        }
    }

    delete(value) {
        let details = '';
        const [newRoot, found] = this._deleteNodeRecursive(this.root, value);
        this.root = newRoot;
        details = found ? `Successfully deleted node with value ${value}.` : `Node with value ${value} was not found.`;
        return { newTree: this, details, result: found ? 'Success' : 'Not Found' };
    }
    
    _deleteNodeRecursive(node, value) {
        if (node === null) {
            return [node, false]; // Not found
        }
    
        if (value < node.value) {
            const [newLeft, found] = this._deleteNodeRecursive(node.left, value);
            node.left = newLeft;
            return [node, found];
        } else if (value > node.value) {
            const [newRight, found] = this._deleteNodeRecursive(node.right, value);
            node.right = newRight;
            return [node, found];
        } else {
            // Node found, perform deletion
            if (node.left === null) {
                return [node.right, true]; // One child or no child
            } else if (node.right === null) {
                return [node.left, true]; // One child or no child
            }
    
            // Two children case: get in-order successor
            const temp = this._minValueNode(node.right);
            node.value = temp.value;
            // Delete the in-order successor
            const [newRight, found] = this._deleteNodeRecursive(node.right, temp.value);
            node.right = newRight;
            return [node, true];
        }
    }
    
    _minValueNode(node) {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current;
    }

    search(value) {
        this.comparisons = 0;
        const path = [];
        let currentNode = this.root;
        let details = `Searching for ${value}... `;
        while (currentNode) {
            this.comparisons++;
            path.push(currentNode.id);
            if (value === currentNode.value) {
                details += `Found ${value}!`;
                return { found: true, path, details };
            }
            if (value < currentNode.value) {
                currentNode = currentNode.left;
                details += `Value is less than current node. Going left. `;
            } else {
                currentNode = currentNode.right;
                details += `Value is greater than current node. Going right. `;
            }
        }
        details += `Node with value ${value} not found.`;
        return { found: false, path, details };
    }

    // Traversals
    inOrderTraversal(node = this.root, path = []) {
        if (node) {
            this.inOrderTraversal(node.left, path);
            path.push(node.value);
            this.inOrderTraversal(node.right, path);
        }
        return path;
    }

    preOrderTraversal(node = this.root, path = []) {
        if (node) {
            path.push(node.value);
            this.preOrderTraversal(node.left, path);
            this.preOrderTraversal(node.right, path);
        }
        return path;
    }

    postOrderTraversal(node = this.root, path = []) {
        if (node) {
            this.postOrderTraversal(node.left, path);
            this.postOrderTraversal(node.right, path);
            path.push(node.value);
        }
        return path;
    }

    // Visualization Helpers
    getTreeData() {
        const allNodes = [];
        this._populateNodes(this.root, allNodes, 0, 0);
        return { root: this.root, allNodes };
    }

    _populateNodes(node, allNodes, level, position) {
        if (node) {
            const horizontalSpacing = 150;
            const verticalSpacing = 70;
            
            node.x = position * horizontalSpacing;
            node.y = level * verticalSpacing;
            allNodes.push(node);
            
            const newPosLeft = position - (1.0 / (2 ** level));
            const newPosRight = position + (1.0 / (2 ** level));

            this._populateNodes(node.left, allNodes, level + 1, newPosLeft);
            this._populateNodes(node.right, allNodes, level + 1, newPosRight);
        }
    }

    getHeight(node = this.root) {
        if (node === null) return 0;
        const leftHeight = this.getHeight(node.left);
        const rightHeight = this.getHeight(node.right);
        return Math.max(leftHeight, rightHeight) + 1;
    }

    countNodes(node = this.root) {
        if (node === null) return 0;
        return 1 + this.countNodes(node.left) + this.countNodes(node.right);
    }
}
