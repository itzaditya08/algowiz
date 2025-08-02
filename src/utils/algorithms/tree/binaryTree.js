import { BST } from './bst';

export class BinaryTree extends BST {
    constructor() {
        super();
        this.rotations = 0;
        this.traversals = {
            inOrder: () => this.inOrderTraversal(this.root, []),
            preOrder: () => this.preOrderTraversal(this.root, []),
            postOrder: () => this.postOrderTraversal(this.root, [])
        };
    }

    insert(value) {
        const newNode = { value, id: this.nodeIdCounter++, left: null, right: null };
        if (this.root === null) {
            this.root = newNode;
            const details = `Inserted ${value} as the root.`;
            return { newTree: this, details, result: 'Success' };
        }
        
        const queue = [this.root];
        while (queue.length > 0) {
            const node = queue.shift();
            if (node.left === null) {
                node.left = newNode;
                return { newTree: this, details: `Inserted ${value} as left child of ${node.value}.`, result: 'Success' };
            } else if (node.right === null) {
                node.right = newNode;
                return { newTree: this, details: `Inserted ${value} as right child of ${node.value}.`, result: 'Success' };
            } else {
                queue.push(node.left);
                queue.push(node.right);
            }
        }
    }
    
    // Note: The delete method is inherited from BST, but for a general binary tree,
    // it's not well-defined. We'll keep the BST's logic for a placeholder.
    
    delete(value) {
        const details = `Deletion for a general binary tree is complex. Using BST logic as a fallback.`;
        const [newRoot, found] = this._deleteNodeRecursive(this.root, value);
        this.root = newRoot;
        return { newTree: this, details, result: found ? 'Success' : 'Not Found' };
    }
}
