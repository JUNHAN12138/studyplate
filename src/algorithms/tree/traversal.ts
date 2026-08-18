import type { Step } from '../types';
import type { TreeNode, TreeState } from './types';

function layoutTree(root: TreeNode | undefined): { nodes: TreeState['nodes']; edges: TreeState['edges'] } {
  const nodes: TreeState['nodes'] = [];
  const edges: TreeState['edges'] = [];
  let idx = 0;

  function dfs(node: TreeNode | undefined, x: number, y: number, spread: number) {
    if (!node) return;
    const myIdx = idx++;
    nodes.push({ val: node.val, x, y, highlighted: false, visited: false });
    if (node.left) {
      edges.push({ from: myIdx, to: idx });
      dfs(node.left, x - spread, y + 60, spread * 0.55);
    }
    if (node.right) {
      edges.push({ from: myIdx, to: idx });
      dfs(node.right, x + spread, y + 60, spread * 0.55);
    }
  }

  dfs(root, 300, 30, 120);
  return { nodes, edges };
}

function buildState(layout: ReturnType<typeof layoutTree>, visitOrder: number[], currentVal?: number): TreeState {
  const nodes = layout.nodes.map((n) => ({
    ...n,
    visited: visitOrder.includes(n.val),
    highlighted: n.val === currentVal,
  }));
  return { nodes, edges: layout.edges, visitOrder, currentVal, desc: '' };
}

export function preorderTraversal(root: TreeNode): Step<TreeState>[] {
  const layout = layoutTree(root);
  const steps: Step<TreeState>[] = [];
  const visited: number[] = [];

  steps.push({ state: buildState(layout, [], undefined), desc: '前序遍历：根 → 左 → 右', lines: [1] });

  function traverse(node: TreeNode | undefined) {
    if (!node) return;
    visited.push(node.val);
    steps.push({ state: buildState(layout, [...visited], node.val), desc: `访问节点 ${node.val}`, lines: [2] });
    traverse(node.left);
    traverse(node.right);
  }
  traverse(root);

  steps.push({ state: buildState(layout, [...visited], undefined), desc: `前序遍历完成: [${visited.join(', ')}]`, lines: [5] });
  return steps;
}

export function inorderTraversal(root: TreeNode): Step<TreeState>[] {
  const layout = layoutTree(root);
  const steps: Step<TreeState>[] = [];
  const visited: number[] = [];

  steps.push({ state: buildState(layout, [], undefined), desc: '中序遍历：左 → 根 → 右', lines: [1] });

  function traverse(node: TreeNode | undefined) {
    if (!node) return;
    traverse(node.left);
    visited.push(node.val);
    steps.push({ state: buildState(layout, [...visited], node.val), desc: `访问节点 ${node.val}`, lines: [3] });
    traverse(node.right);
  }
  traverse(root);

  steps.push({ state: buildState(layout, [...visited], undefined), desc: `中序遍历完成: [${visited.join(', ')}]`, lines: [5] });
  return steps;
}

export function postorderTraversal(root: TreeNode): Step<TreeState>[] {
  const layout = layoutTree(root);
  const steps: Step<TreeState>[] = [];
  const visited: number[] = [];

  steps.push({ state: buildState(layout, [], undefined), desc: '后序遍历：左 → 右 → 根', lines: [1] });

  function traverse(node: TreeNode | undefined) {
    if (!node) return;
    traverse(node.left);
    traverse(node.right);
    visited.push(node.val);
    steps.push({ state: buildState(layout, [...visited], node.val), desc: `访问节点 ${node.val}`, lines: [4] });
  }
  traverse(root);

  steps.push({ state: buildState(layout, [...visited], undefined), desc: `后序遍历完成: [${visited.join(', ')}]`, lines: [5] });
  return steps;
}

export function levelorderTraversal(root: TreeNode): Step<TreeState>[] {
  const layout = layoutTree(root);
  const steps: Step<TreeState>[] = [];
  const visited: number[] = [];
  const queue: TreeNode[] = [root];

  steps.push({ state: buildState(layout, [], undefined), desc: '层序遍历：逐层从左到右', lines: [1] });

  while (queue.length > 0) {
    const node = queue.shift()!;
    visited.push(node.val);
    steps.push({ state: buildState(layout, [...visited], node.val), desc: `访问节点 ${node.val}`, lines: [3, 4] });
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
  }

  steps.push({ state: buildState(layout, [...visited], undefined), desc: `层序遍历完成: [${visited.join(', ')}]`, lines: [6] });
  return steps;
}

export const traversalCode = `function preorder(node) {           // 1
  if (!node) return;                  // 2
  visit(node);                        // 3 (前序在此)
  preorder(node.left);                // 4 (中序在此visit)
  preorder(node.right);               // 5 (后序在此visit)
}
function levelorder(root) {           // 1
  const queue = [root];               // 2
  while (queue.length) {              // 3
    const node = queue.shift();       // 4
    visit(node);
    if (node.left) queue.push(node.left);  // 5
    if (node.right) queue.push(node.right);// 6
  }
}`;
