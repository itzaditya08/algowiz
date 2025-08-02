import { Graph } from './index.js';

class Prim {
    constructor(graph, startNode) {
        this.graph = new Graph();
        Object.assign(this.graph, graph);
        this.startNode = startNode;
        this.minHeap = [];
        this.visited = new Set();
        this.mstEdges = [];
        this.totalWeight = 0;
        this.isComplete = false;

        this.minHeap.push({ weight: 0, from: null, to: startNode });
    }

    step() {
        if (this.isComplete) {
            return { isComplete: true, details: 'Prim\'s algorithm complete.', graphState: this.graph, metrics: { mstEdges: this.mstEdges, totalWeight: this.totalWeight } };
        }

        if (this.minHeap.length === 0) {
            this.isComplete = true;
            return { isComplete: true, details: 'Prim\'s algorithm complete. All reachable nodes have been added to the MST.', graphState: this.graph, metrics: { mstEdges: this.mstEdges, totalWeight: this.totalWeight } };
        }

        this.minHeap.sort((a, b) => a.weight - b.weight);
        const { weight, from, to } = this.minHeap.shift();

        if (this.visited.has(to)) {
            return this.step();
        }
        
        this.visited.add(to);
        this.graph.nodes[to].state = 'visited';
        
        if (from !== null) {
            this.mstEdges.push({ from, to, weight });
            this.totalWeight += weight;
            const edge = this.graph.edges.find(e => 
                (e.from === from && e.to === to) || (e.from === to && e.to === from)
            );
            if (edge) {
                edge.isHighlighted = true;
            }
        }

        for (const neighbor of this.graph.adjList[to]) {
            if (!this.visited.has(neighbor.node)) {
                this.minHeap.push({ weight: neighbor.weight, from: to, to: neighbor.node });
                this.graph.nodes[neighbor.node].state = 'active';
            }
        }

        return {
            isComplete: false,
            details: from ? `Adding edge (${from}, ${to}) to MST with weight ${weight}.` : `Starting at node ${to}.`,
            graphState: this.graph,
        };
    }
}

export default Prim;