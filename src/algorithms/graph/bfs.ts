import type { Step } from '../types';
import type { GraphState, GraphNode, GraphEdge } from './types';

export function graphBFS(
  nodes: GraphNode[],
  edges: GraphEdge[],
  start: number
): Step<GraphState>[] {
  const steps: Step<GraphState>[] = [];
  const adj = new Map<number, number[]>();
  for (const n of nodes) adj.set(n.id, []);
  for (const e of edges) {
    adj.get(e.from)!.push(e.to);
    adj.get(e.to)!.push(e.from);
  }

  const visited: number[] = [start];
  const queue: number[] = [start];
  const edgeHighlight: [number, number][] = [];

  steps.push({
    state: { nodes, edges, visited: [...visited], current: start, queue: [...queue], edgeHighlight: [] },
    desc: `BFS 从节点 ${start} 开始，加入队列`,
    lines: [1, 2],
  });

  while (queue.length > 0) {
    const v = queue.shift()!;
    steps.push({
      state: { nodes, edges, visited: [...visited], current: v, queue: [...queue], edgeHighlight: [...edgeHighlight] },
      desc: `出队节点 ${v}`,
      lines: [3, 4],
    });

    for (const u of adj.get(v) ?? []) {
      if (!visited.includes(u)) {
        visited.push(u);
        queue.push(u);
        edgeHighlight.push([v, u]);
        steps.push({
          state: { nodes, edges, visited: [...visited], current: v, queue: [...queue], edgeHighlight: [...edgeHighlight] },
          desc: `发现邻居 ${u}，加入队列`,
          lines: [5, 6],
        });
      }
    }
  }

  steps.push({
    state: { nodes, edges, visited: [...visited], current: undefined, queue: [], edgeHighlight: [...edgeHighlight] },
    desc: `BFS 完成，遍历顺序: [${visited.join(', ')}]`,
    lines: [8],
  });
  return steps;
}

export const bfsCode = `function bfs(graph, start) {
  const visited = new Set([start]);    // 1
  const queue = [start];               // 2
  while (queue.length > 0) {           // 3
    const v = queue.shift();           // 4
    for (const u of graph[v]) {        // 5
      if (!visited.has(u)) {           // 6
        visited.add(u); queue.push(u); // 7
      }
    }
  }                                    // 8
}`;
