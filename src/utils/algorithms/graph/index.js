// Import all modularized algorithms
import DFS from './dfs.js';
import BFS from './bfs.js';
import Dijkstra from './dijkstra.js';
import BellmanFord from './bellmanFord.js';
import FloydWarshall from './floydWarshall.js';
import Prim from './prim.js';
import Kruskal from './kruskal.js';



// Helper class for Kruskal's Algorithm to manage disjoint sets.
export class DisjointSet {
    constructor(nodes) {
        this.parent = {};
        nodes.forEach(node => {
            this.parent[node] = node;
        });
    }

    find(i) {
        if (this.parent[i] === i) {
            return i;
        }
        this.parent[i] = this.find(this.parent[i]);
        return this.parent[i];
    }

    union(i, j) {
        const rootI = this.find(i);
        const rootJ = this.find(j);
        if (rootI !== rootJ) {
            this.parent[rootJ] = rootI;
            return true;
        }
        return false;
    }
}

// Main Graph data structure.
export class Graph {
    constructor() {
        this.nodes = {};
        this.edges = [];
        this.adjList = {};
    }

    addNode(nodeId) {
        if (!this.nodes[nodeId]) {
            const x = Math.floor(Math.random() * (700 - 48));
            const y = Math.floor(Math.random() * (400 - 48));
            this.nodes[nodeId] = { id: nodeId, x, y, state: 'unvisited', isHighlighted: false, distance: Infinity };
            this.adjList[nodeId] = [];
        }
        return this;
    }

    addEdge(from, to, weight = 1, isDirected = false) {
        if (this.nodes[from] && this.nodes[to]) {
            this.adjList[from].push({ node: to, weight });
            this.edges.push({ from, to, weight, isHighlighted: false });
            if (!isDirected) {
                this.adjList[to].push({ node: from, weight });
                this.edges.push({ from: to, to: from, weight, isHighlighted: false });
            }
        }
        return this;
    }

    getNodes() {
        return Object.keys(this.nodes);
    }

    getGraphData() {
        return {
            nodes: Object.values(this.nodes),
            edges: this.edges,
        };
    }

    resetVisualState() {
        Object.values(this.nodes).forEach(node => {
            node.state = 'unvisited';
            node.isHighlighted = false;
            node.distance = Infinity;
        });
        this.edges.forEach(edge => edge.isHighlighted = false);
        return new Graph();
    }
}

// Export all the algorithm classes for easy import in other files.
export { DFS, BFS, Dijkstra, BellmanFord, FloydWarshall, Prim, Kruskal };