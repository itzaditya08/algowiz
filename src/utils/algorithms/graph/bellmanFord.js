import { Graph } from './index.js';

class BellmanFord {
    constructor(graph, startNode) {
        this.graph = new Graph();
        Object.assign(this.graph, graph);
        this.startNode = startNode;
        this.distances = {};
        this.previous = {};
        this.iterations = Object.keys(this.graph.nodes).length;
        this.edgeIndex = 0;
        this.isComplete = false;
        this.edges = this.graph.edges;

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
            return { isComplete: true, details: 'Bellman-Ford algorithm complete.', graphState: this.graph, metrics: { distances: this.distances, paths: this.previous } };
        }

        this.graph.edges.forEach(edge => edge.isHighlighted = false);

        if (this.iterations > 0) {
            if (this.edgeIndex < this.edges.length) {
                const edge = this.edges[this.edgeIndex];
                const { from, to, weight } = edge;

                this.graph.edges.find(e => e.from === from && e.to === to).isHighlighted = true;

                if (this.distances[from] !== Infinity && this.distances[from] + weight < this.distances[to]) {
                    this.distances[to] = this.distances[from] + weight;
                    this.previous[to] = from;
                    this.graph.nodes[to].distance = this.distances[to];
                    this.graph.nodes[to].state = 'active';
                    this.edgeIndex++;
                    return { isComplete: false, details: `Relaxing edge (${from}, ${to}). Updated distance to ${to} is ${this.distances[to]}.`, graphState: this.graph };
                }

                this.edgeIndex++;
                return { isComplete: false, details: `Checking edge (${from}, ${to}). No update needed.`, graphState: this.graph };
            } else {
                this.edgeIndex = 0;
                this.iterations--;
                return { isComplete: false, details: `Iteration ${Object.keys(this.graph.nodes).length - this.iterations} completed.`, graphState: this.graph };
            }
        }

        for (const edge of this.edges) {
            const { from, to, weight } = edge;
            if (this.distances[from] !== Infinity && this.distances[from] + weight < this.distances[to]) {
                this.isComplete = true;
                return { isComplete: true, details: `Negative cycle detected! Edge (${from}, ${to}) is part of a negative cycle.`, graphState: this.graph, metrics: { hasNegativeCycle: true } };
            }
        }

        this.isComplete = true;
        return { isComplete: true, details: 'Bellman-Ford algorithm complete. No negative cycles detected.', graphState: this.graph, metrics: { distances: this.distances, paths: this.previous, hasNegativeCycle: false } };
    }
}

export default BellmanFord;