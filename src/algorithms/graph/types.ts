export interface GraphNode {
  id: number;
  x: number;
  y: number;
}

export interface GraphEdge {
  from: number;
  to: number;
  weight?: number;
}

export interface GraphState {
  nodes: GraphNode[];
  edges: GraphEdge[];
  visited: number[];
  current?: number;
  queue: number[];
  edgeHighlight: [number, number][];
}
