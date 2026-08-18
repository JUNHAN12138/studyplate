import React, { useMemo } from 'react';
import { Tabs, Alert } from 'antd';
import { usePlayer } from '../hooks/usePlayer';
import { Player } from '../components/Player';
import { CodePanel } from '../components/CodePanel';
import { preorderTraversal, inorderTraversal, postorderTraversal, levelorderTraversal, traversalCode } from '../algorithms/tree/traversal';
import { bstInsert, bstSearch, bstCode } from '../algorithms/tree/bst';
import type { TreeNode } from '../algorithms/tree/types';
import type { TreeState } from '../algorithms/tree/types';

const DEMO_TREE: TreeNode = {
  val: 8,
  left: { val: 4, left: { val: 2 }, right: { val: 6 } },
  right: { val: 12, left: { val: 10 }, right: { val: 14 } },
};

function TreeViz({ state }: { state: TreeState }) {
  return (
    <svg width={600} height={280} style={{ display: 'block', margin: '8px 0' }}>
      {state.edges.map((e, i) => {
        const from = state.nodes[e.from];
        const to = state.nodes[e.to];
        return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke="#ccc" strokeWidth={2} />;
      })}
      {state.nodes.map((n, i) => (
        <g key={i}>
          <circle cx={n.x} cy={n.y} r={18}
            fill={n.highlighted ? '#faad14' : n.visited ? '#52c41a' : '#fff'}
            stroke={n.highlighted ? '#d48806' : '#1677ff'} strokeWidth={2} />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={13} fontWeight={500}
            fill={n.highlighted || n.visited ? '#fff' : '#333'}>{n.val}</text>
        </g>
      ))}
    </svg>
  );
}

function TreeDemo({ steps, code }: { steps: { state: TreeState; desc: string; lines?: number[] }[]; code: string }) {
  const player = usePlayer(steps);
  return (
    <div>
      <Alert title={player.step.desc} type="info" showIcon style={{ marginBottom: 12 }} />
      <TreeViz state={player.step.state} />
      <Player player={player} />
      <CodePanel code={code} highlightLines={player.step.lines} />
    </div>
  );
}

export const TreeView: React.FC = () => {
  const preSteps = useMemo(() => preorderTraversal(DEMO_TREE), []);
  const inSteps = useMemo(() => inorderTraversal(DEMO_TREE), []);
  const postSteps = useMemo(() => postorderTraversal(DEMO_TREE), []);
  const levelSteps = useMemo(() => levelorderTraversal(DEMO_TREE), []);
  const insertSteps = useMemo(() => bstInsert(DEMO_TREE, 5), []);
  const searchSteps = useMemo(() => bstSearch(DEMO_TREE, 10), []);

  return (
    <Tabs items={[
      { key: 'pre', label: '前序', children: <TreeDemo steps={preSteps} code={traversalCode} /> },
      { key: 'in', label: '中序', children: <TreeDemo steps={inSteps} code={traversalCode} /> },
      { key: 'post', label: '后序', children: <TreeDemo steps={postSteps} code={traversalCode} /> },
      { key: 'level', label: '层序', children: <TreeDemo steps={levelSteps} code={traversalCode} /> },
      { key: 'insert', label: 'BST 插入', children: <TreeDemo steps={insertSteps} code={bstCode} /> },
      { key: 'search', label: 'BST 查找', children: <TreeDemo steps={searchSteps} code={bstCode} /> },
    ]} />
  );
};
