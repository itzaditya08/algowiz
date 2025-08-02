import { Graph } from './index.js';

class BFS {
    constructor(graph, startNode) {
        this.graph = new Graph();
        Object.assign(this.graph, graph);
        this.startNode = startNode;
        this.queue = [startNode];
        this.visited = new Set([startNode]);
        this.path = [startNode];
        this.graph.nodes[startNode].state = 'active';
        this.isComplete = false;
    }

    step() {
        if (this.isComplete) {
            return { isComplete: true, details: 'BFS traversal complete.', graphState: this.graph, metrics: { traversalOrder: this.path } };
        }

        if (this.queue.length === 0) {
            this.isComplete = true;
            return {
                isComplete: true,
                details: 'BFS traversal complete.',
                graphState: this.graph,
                metrics: { traversalOrder: this.path },
            };
        }

        const currentNodeId = this.queue.shift();
        this.graph.nodes[currentNodeId].isHighlighted = true;
        this.graph.nodes[currentNodeId].state = 'visited';
        
        const neighbors = this.graph.adjList[currentNodeId] || [];
        for (const neighbor of neighbors) {
            if (!this.visited.has(neighbor.node)) {
                this.visited.add(neighbor.node);
                this.queue.push(neighbor.node);
                this.path.push(neighbor.node);
                this.graph.nodes[neighbor.node].state = 'active';
            }
        }

        return {
            isComplete: false,
            details: `Visiting node ${currentNodeId}. Neighbors to visit: ${neighbors.filter(n => !this.visited.has(n.node)).map(n => n.node).join(', ')}.`,
            graphState: this.graph,
        };
    }
}

export default BFS;