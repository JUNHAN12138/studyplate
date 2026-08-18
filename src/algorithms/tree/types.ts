export interface TreeNode {
  val: number;
  left?: TreeNode;
  right?: TreeNode;
}

export interface TreeState {
  nodes: { val: number; x: number; y: number; highlighted: boolean; visited: boolean }[];
  edges: { from: number; to: number }[];
  visitOrder: number[];
  currentVal?: number;
  desc: string;
}
