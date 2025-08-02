import { Graph, DisjointSet } from './index.js';

class Kruskal {
    constructor(graph) {
        this.graph = new Graph();
        Object.assign(this.graph, graph);
        this.sortedEdges = this.graph.edges.slice().sort((a, b) => a.weight - b.weight);
        this.ds = new DisjointSet(Object.keys(this.graph.nodes));
        this.mstEdges = [];
        this.totalWeight = 0;
        this.edgeIndex = 0;
        this.isComplete = false;
    }

    step() {
        if (this.isComplete) {
            return { isComplete: true, details: 'Kruskal\'s algorithm complete.', graphState: this.graph, metrics: { mstEdges: this.mstEdges, totalWeight: this.totalWeight } };
        }

        this.graph.edges.forEach(edge => edge.isHighlighted = false);

        if (this.edgeIndex >= this.sortedEdges.length || this.mstEdges.length >= Object.keys(this.graph.nodes).length - 1) {
            this.isComplete = true;
            return { isComplete: true, details: 'Kruskal\'s algorithm complete. MST finalized.', graphState: this.graph, metrics: { mstEdges: this.mstEdges, totalWeight: this.totalWeight } };
        }

        const currentEdge = this.sortedEdges[this.edgeIndex];
        this.edgeIndex++;

        this.graph.edges.find(e => e.from === currentEdge.from && e.to === currentEdge.to).isHighlighted = true;
        this.graph.nodes[currentEdge.from].state = 'active';
        this.graph.nodes[currentEdge.to].state = 'active';

        if (this.ds.union(currentEdge.from, currentEdge.to)) {
            this.mstEdges.push(currentEdge);
            this.totalWeight += currentEdge.weight;
            this.graph.nodes[currentEdge.from].state = 'visited';
            this.graph.nodes[currentEdge.to].state = 'visited';
            return { isComplete: false, details: `Adding edge (${currentEdge.from}, ${currentEdge.to}) with weight ${currentEdge.weight} to MST.`, graphState: this.graph };
        } else {
            return { isComplete: false, details: `Ignoring edge (${currentEdge.from}, ${currentEdge.to}). It forms a cycle.`, graphState: this.graph };
        }
    }
}

export default Kruskal;