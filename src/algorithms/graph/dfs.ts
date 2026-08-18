import type { Step } from '../types';
import type { GraphState, GraphNode, GraphEdge } from './types';

export function graphDFS(
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

  const visited: number[] = [];
  const edgeHighlight: [number, number][] = [];

  steps.push({
    state: { nodes, edges, visited: [], current: start, queue: [], edgeHighlight: [] },
    desc: `DFS 从节点 ${start} 开始`,
    lines: [1],
  });

  function dfs(v: number) {
    visited.push(v);
    steps.push({
      state: { nodes, edges, visited: [...visited], current: v, queue: [], edgeHighlight: [...edgeHighlight] },
      desc: `访问节点 ${v}`,
      lines: [2, 3],
    });

    for (const u of adj.get(v) ?? []) {
      if (!visited.includes(u)) {
        edgeHighlight.push([v, u]);
        steps.push({
          state: { nodes, edges, visited: [...visited], current: v, queue: [], edgeHighlight: [...edgeHighlight] },
          desc: `从 ${v} 走向 ${u}`,
          lines: [4, 5],
        });
        dfs(u);
      }
    }
  }

  dfs(start);
  steps.push({
    state: { nodes, edges, visited: [...visited], current: undefined, queue: [], edgeHighlight: [...edgeHighlight] },
    desc: `DFS 完成，遍历顺序: [${visited.join(', ')}]`,
    lines: [7],
  });
  return steps;
}

export const dfsCode = `function dfs(graph, start) {
  const visited = new Set();          // 1
  function visit(v) {                  // 2
    visited.add(v);                    // 3
    for (const u of graph[v]) {        // 4
      if (!visited.has(u)) visit(u);   // 5
    }
  }                                    // 6
  visit(start);                        // 7
}`;
