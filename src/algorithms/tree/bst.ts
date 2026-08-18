import type { Step } from '../types';
import type { TreeNode, TreeState } from './types';

function cloneTree(node: TreeNode | undefined): TreeNode | undefined {
  if (!node) return undefined;
  return { val: node.val, left: cloneTree(node.left), right: cloneTree(node.right) };
}

function layoutTree(root: TreeNode | undefined): { nodes: TreeState['nodes']; edges: TreeState['edges'] } {
  const nodes: TreeState['nodes'] = [];
  const edges: TreeState['edges'] = [];
  let idx = 0;
  function dfs(node: TreeNode | undefined, x: number, y: number, spread: number) {
    if (!node) return;
    const myIdx = idx++;
    nodes.push({ val: node.val, x, y, highlighted: false, visited: false });
    if (node.left) { edges.push({ from: myIdx, to: idx }); dfs(node.left, x - spread, y + 60, spread * 0.55); }
    if (node.right) { edges.push({ from: myIdx, to: idx }); dfs(node.right, x + spread, y + 60, spread * 0.55); }
  }
  dfs(root, 300, 30, 120);
  return { nodes, edges };
}

function buildState(root: TreeNode | undefined, path: number[], currentVal?: number): TreeState {
  const layout = layoutTree(root);
  const nodes = layout.nodes.map((n) => ({
    ...n,
    visited: path.includes(n.val),
    highlighted: n.val === currentVal,
  }));
  return { nodes, edges: layout.edges, visitOrder: path, currentVal, desc: '' };
}

export function bstInsert(root: TreeNode | undefined, value: number): Step<TreeState>[] {
  const steps: Step<TreeState>[] = [];
  const tree = cloneTree(root);
  const path: number[] = [];

  steps.push({ state: buildState(tree, [], undefined), desc: `BST 插入 ${value}`, lines: [1] });

  function insert(node: TreeNode | undefined, parent: TreeNode | undefined, isLeft: boolean): TreeNode {
    if (!node) {
      const newNode: TreeNode = { val: value };
      if (parent) {
        if (isLeft) parent.left = newNode;
        else parent.right = newNode;
      }
      path.push(value);
      steps.push({ state: buildState(tree ?? newNode, [...path], value), desc: `插入 ${value} 到空位`, lines: [3] });
      return newNode;
    }
    path.push(node.val);
    if (value < node.val) {
      steps.push({ state: buildState(tree!, [...path], node.val), desc: `${value} < ${node.val}，往左子树`, lines: [4] });
      insert(node.left, node, true);
    } else {
      steps.push({ state: buildState(tree!, [...path], node.val), desc: `${value} >= ${node.val}，往右子树`, lines: [5] });
      insert(node.right, node, false);
    }
    return node;
  }

  const result = insert(tree, undefined, false);
  steps.push({ state: buildState(tree ?? result, [...path], undefined), desc: `插入完成`, lines: [6] });
  return steps;
}

export function bstSearch(root: TreeNode, target: number): Step<TreeState>[] {
  const steps: Step<TreeState>[] = [];
  const path: number[] = [];

  steps.push({ state: buildState(root, [], undefined), desc: `BST 查找 ${target}`, lines: [1] });

  let node: TreeNode | undefined = root;
  while (node) {
    path.push(node.val);
    if (node.val === target) {
      steps.push({ state: buildState(root, [...path], node.val), desc: `找到 ${target}！`, lines: [2, 3] });
      return steps;
    } else if (target < node.val) {
      steps.push({ state: buildState(root, [...path], node.val), desc: `${target} < ${node.val}，往左`, lines: [4] });
      node = node.left;
    } else {
      steps.push({ state: buildState(root, [...path], node.val), desc: `${target} > ${node.val}，往右`, lines: [5] });
      node = node.right;
    }
  }

  steps.push({ state: buildState(root, [...path], undefined), desc: `未找到 ${target}`, lines: [6] });
  return steps;
}

export const bstCode = `function bstInsert(root, val) {       // 1
  if (!root) return { val };            // 2,3
  if (val < root.val)                   // 4
    root.left = bstInsert(root.left, val);
  else                                  // 5
    root.right = bstInsert(root.right, val);
  return root;                          // 6
}`;
