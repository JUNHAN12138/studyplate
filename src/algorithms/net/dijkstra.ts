import type { Step } from '../types';
import type { GraphNode, GraphEdge } from '../graph/types';

export interface DijkstraState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  dist: Record<number, number>;
  prev: Record<number, number | null>;
  visited: number[];
  current?: number;
  relaxingEdge?: [number, number];
}

export function dijkstra(
  nodes: GraphNode[],
  edges: GraphEdge[],
  start: number
): Step<DijkstraState>[] {
  const steps: Step<DijkstraState>[] = [];
  const dist: Record<number, number> = {};
  const prev: Record<number, number | null> = {};
  const visited: number[] = [];

  for (const n of nodes) {
    dist[n.id] = n.id === start ? 0 : Infinity;
    prev[n.id] = null;
  }

  steps.push({
    state: { nodes, edges, dist: { ...dist }, prev: { ...prev }, visited: [], current: start },
    desc: `Dijkstra 从节点 ${start} 开始，初始化距离`,
    lines: [1],
  });

  const unvisited = new Set(nodes.map(n => n.id));

  while (unvisited.size > 0) {
    // Pick min distance unvisited node
    let u = -1;
    let minD = Infinity;
    for (const id of unvisited) {
      if (dist[id] < minD) { minD = dist[id]; u = id; }
    }
    if (u === -1 || dist[u] === Infinity) break;

    unvisited.delete(u);
    visited.push(u);

    steps.push({
      state: { nodes, edges, dist: { ...dist }, prev: { ...prev }, visited: [...visited], current: u },
      desc: `选择距离最小的未访问节点 ${u}（距离=${dist[u]}）`,
      lines: [2, 3],
    });

    // Relax neighbors
    for (const e of edges) {
      let neighbor = -1;
      if (e.from === u) neighbor = e.to;
      else if (e.to === u) neighbor = e.from;
      else continue;
      if (!unvisited.has(neighbor)) continue;

      const w = e.weight ?? 1;
      const alt = dist[u] + w;
      if (alt < dist[neighbor]) {
        dist[neighbor] = alt;
        prev[neighbor] = u;
        steps.push({
          state: { nodes, edges, dist: { ...dist }, prev: { ...prev }, visited: [...visited], current: u, relaxingEdge: [u, neighbor] },
          desc: `松弛边 ${u}→${neighbor}：距离更新为 ${alt}`,
          lines: [4, 5],
        });
      }
    }
  }

  steps.push({
    state: { nodes, edges, dist: { ...dist }, prev: { ...prev }, visited: [...visited], current: undefined },
    desc: `Dijkstra 完成，最短距离: ${JSON.stringify(dist)}`,
    lines: [6],
  });
  return steps;
}

export const dijkstraCode = `function dijkstra(graph, start) {
  dist[start] = 0; 其余 = ∞;          // 1
  while (unvisited.size > 0) {         // 2
    u = 取 dist 最小的未访问节点;       // 3
    for (v of neighbors(u)) {          // 4
      if (dist[u]+w(u,v) < dist[v])    // 5
        dist[v] = dist[u]+w(u,v);
    }
  }                                    // 6
}`;
