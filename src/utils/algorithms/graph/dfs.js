import { Graph } from './index.js';

class DFS {
    constructor(graph, startNode) {
        this.graph = new Graph();
        Object.assign(this.graph, graph);
        this.startNode = startNode;
        this.stack = [startNode];
        this.visited = new Set();
        this.path = [];
        this.isComplete = false;
        this.graph.nodes[startNode].state = 'active';
    }

    step() {
        if (this.isComplete) {
            return { isComplete: true, details: 'DFS traversal complete.', graphState: this.graph, metrics: { traversalOrder: this.path } };
        }

        if (this.stack.length === 0) {
            this.isComplete = true;
            return { isComplete: true, details: 'DFS traversal complete.', graphState: this.graph, metrics: { traversalOrder: this.path } };
        }

        const currentNodeId = this.stack.pop();
        this.graph.nodes[currentNodeId].isHighlighted = false;

        if (!this.visited.has(currentNodeId)) {
            this.visited.add(currentNodeId);
            this.path.push(currentNodeId);
            this.graph.nodes[currentNodeId].state = 'visited';
            this.graph.nodes[currentNodeId].isHighlighted = true;
            
            const neighbors = this.graph.adjList[currentNodeId] || [];
            for (let i = neighbors.length - 1; i >= 0; i--) {
                const neighbor = neighbors[i];
                if (!this.visited.has(neighbor.node)) {
                    this.stack.push(neighbor.node);
                    this.graph.nodes[neighbor.node].state = 'active';
                }
            }
            return {
                isComplete: false,
                details: `Visiting node ${currentNodeId}.`,
                graphState: this.graph,
            };
        }

        return this.step();
    }
}

export default DFS;