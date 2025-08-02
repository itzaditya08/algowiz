import { Graph } from './index.js';

class FloydWarshall {
    constructor(graph) {
        this.graph = new Graph();
        Object.assign(this.graph, graph);
        this.nodes = Object.keys(this.graph.nodes);
        this.dist = {};
        this.k = 0;
        this.i = 0;
        this.j = 0;
        this.isComplete = false;

        this.nodes.forEach(u => {
            this.dist[u] = {};
            this.nodes.forEach(v => {
                this.dist[u][v] = (u === v) ? 0 : Infinity;
            });
        });

        this.graph.edges.forEach(edge => {
            if (this.dist[edge.from][edge.to] > edge.weight) {
                 this.dist[edge.from][edge.to] = edge.weight;
            }
        });
    }

    step() {
        if (this.isComplete) {
            return { isComplete: true, details: 'Floyd-Warshall algorithm complete.', graphState: this.graph, metrics: { distanceMatrix: this.dist } };
        }
        
        const kNode = this.nodes[this.k];
        const iNode = this.nodes[this.i];
        const jNode = this.nodes[this.j];
        
        if (this.i < this.nodes.length) {
            if (this.j < this.nodes.length) {
                if (this.dist[iNode][kNode] !== Infinity && this.dist[kNode][jNode] !== Infinity) {
                    const newDist = this.dist[iNode][kNode] + this.dist[kNode][jNode];
                    if (newDist < this.dist[iNode][jNode]) {
                        this.dist[iNode][jNode] = newDist;
                        this.j++;
                        return { isComplete: false, details: `Updating path from ${iNode} to ${jNode} via intermediate node ${kNode}. New distance: ${newDist}.`, graphState: this.graph };
                    }
                }
                this.j++;
                return { isComplete: false, details: `Checking path from ${iNode} to ${jNode} via intermediate node ${kNode}. No update needed.`, graphState: this.graph };
            } else {
                this.i++;
                this.j = 0;
                return this.step();
            }
        } else {
            this.k++;
            this.i = 0;
            this.j = 0;
            if (this.k < this.nodes.length) {
                return this.step();
            } else {
                this.isComplete = true;
                return { isComplete: true, details: 'Floyd-Warshall algorithm complete.', graphState: this.graph, metrics: { distanceMatrix: this.dist } };
            }
        }
    }
}

export default FloydWarshall;