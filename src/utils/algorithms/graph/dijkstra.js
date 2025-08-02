import { Graph } from './index.js';

class Dijkstra {
    constructor(graph, startNode) {
        this.graph = new Graph();
        Object.assign(this.graph, graph);
        this.startNode = startNode;
        this.distances = {};
        this.previous = {};
        this.visited = new Set();
        this.isComplete = false;
        
        Object.keys(this.graph.nodes).forEach(node => {
            this.distances[node] = Infinity;
            this.previous[node] = null;
            this.graph.nodes[node].distance = Infinity;
        });

        this.distances[startNode] = 0;
        this.graph.nodes[startNode].distance = 0;
    }

    step() {
        if (this.isComplete) {
            return { isComplete: true, details: 'Dijkstra\'s algorithm complete.', graphState: this.graph, metrics: { distances: this.distances, paths: this.previous } };
        }

        const unvisitedNodes = Object.keys(this.graph.nodes).filter(node => !this.visited.has(node));
        if (unvisitedNodes.length === 0) {
            this.isComplete = true;
            return { isComplete: true, details: 'Dijkstra\'s algorithm complete. All reachable nodes visited.', graphState: this.graph, metrics: { distances: this.distances, paths: this.previous } };
        }

        let currentNodeId = unvisitedNodes.reduce((minNode, node) => (
            this.distances[node] < this.distances[minNode] ? node : minNode
        ), unvisitedNodes[0]);

        if (this.distances[currentNodeId] === Infinity) {
            this.isComplete = true;
            return { isComplete: true, details: 'All reachable nodes visited.', graphState: this.graph, metrics: { distances: this.distances, paths: this.previous } };
        }

        this.visited.add(currentNodeId);
        this.graph.nodes[currentNodeId].state = 'visited';
        this.graph.nodes[currentNodeId].isHighlighted = true;

        for (const neighbor of this.graph.adjList[currentNodeId]) {
            const newDist = this.distances[currentNodeId] + neighbor.weight;
            if (newDist < this.distances[neighbor.node]) {
                this.distances[neighbor.node] = newDist;
                this.previous[neighbor.node] = currentNodeId;
                this.graph.nodes[neighbor.node].distance = newDist;
                this.graph.nodes[neighbor.node].state = 'active';
            }
        }

        return {
            isComplete: false,
            details: `Visiting node ${currentNodeId} with distance ${this.distances[currentNodeId]}.`,
            graphState: this.graph,
        };
    }
}

export default Dijkstra;