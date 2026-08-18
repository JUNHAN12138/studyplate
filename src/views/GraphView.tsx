import React, { useMemo } from 'react';
import { Tabs, Alert } from 'antd';
import { usePlayer } from '../hooks/usePlayer';
import { Player } from '../components/Player';
import { CodePanel } from '../components/CodePanel';
import { graphDFS, dfsCode } from '../algorithms/graph/dfs';
import { graphBFS, bfsCode } from '../algorithms/graph/bfs';
import type { GraphState } from '../algorithms/graph/types';
import type { GraphNode, GraphEdge } from '../algorithms/graph/types';

const DEMO_NODES: GraphNode[] = [
  { id: 0, x: 100, y: 50 }, { id: 1, x: 200, y: 50 },
  { id: 2, x: 50, y: 150 }, { id: 3, x: 150, y: 150 },
  { id: 4, x: 250, y: 150 }, { id: 5, x: 150, y: 250 },
];
const DEMO_EDGES: GraphEdge[] = [
  { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 0, to: 3 },
  { from: 1, to: 4 }, { from: 2, to: 3 }, { from: 3, to: 5 }, { from: 4, to: 5 },
];

function GraphViz({ state }: { state: GraphState }) {
  return (
    <svg width={350} height={300} style={{ display: 'block', margin: '8px 0' }}>
      {state.edges.map((e, i) => {
        const from = state.nodes.find(n => n.id === e.from)!;
        const to = state.nodes.find(n => n.id === e.to)!;
        const highlighted = state.edgeHighlight.some(([a, b]) => (a === e.from && b === e.to) || (a === e.to && b === e.from));
        return <line key={i} x1={from.x} y1={from.y} x2={to.x} y2={to.y}
          stroke={highlighted ? '#faad14' : '#ccc'} strokeWidth={highlighted ? 3 : 2} />;
      })}
      {state.nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={20}
            fill={n.id === state.current ? '#faad14' : state.visited.includes(n.id) ? '#52c41a' : '#fff'}
            stroke="#1677ff" strokeWidth={2} />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={14} fontWeight={600}
            fill={state.visited.includes(n.id) ? '#fff' : '#333'}>{n.id}</text>
        </g>
      ))}
    </svg>
  );
}

function GraphDemo({ steps, code }: { steps: { state: GraphState; desc: string; lines?: number[] }[]; code: string }) {
  const player = usePlayer(steps);
  return (
    <div>
      <Alert title={player.step.desc} type="info" showIcon style={{ marginBottom: 12 }} />
      <GraphViz state={player.step.state} />
      <Player player={player} />
      <CodePanel code={code} highlightLines={player.step.lines} />
    </div>
  );
}

export const GraphView: React.FC = () => {
  const dfsSteps = useMemo(() => graphDFS(DEMO_NODES, DEMO_EDGES, 0), []);
  const bfsSteps = useMemo(() => graphBFS(DEMO_NODES, DEMO_EDGES, 0), []);

  return (
    <Tabs items={[
      { key: 'dfs', label: 'DFS', children: <GraphDemo steps={dfsSteps} code={dfsCode} /> },
      { key: 'bfs', label: 'BFS', children: <GraphDemo steps={bfsSteps} code={bfsCode} /> },
    ]} />
  );
};
