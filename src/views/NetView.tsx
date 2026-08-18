import React, { useMemo } from 'react';
import { Tabs, Alert } from 'antd';
import { usePlayer } from '../hooks/usePlayer';
import { Player } from '../components/Player';
import { CodePanel } from '../components/CodePanel';
import { dijkstra, dijkstraCode } from '../algorithms/net/dijkstra';
import { tcpThreeWayHandshake, tcpCode } from '../algorithms/net/tcpHandshake';
import type { DijkstraState } from '../algorithms/net/dijkstra';
import type { TcpState } from '../algorithms/net/tcpHandshake';
import type { GraphNode, GraphEdge } from '../algorithms/graph/types';

const NET_NODES: GraphNode[] = [
  { id: 0, x: 80, y: 120 }, { id: 1, x: 200, y: 50 },
  { id: 2, x: 200, y: 190 }, { id: 3, x: 320, y: 50 },
  { id: 4, x: 320, y: 190 }, { id: 5, x: 420, y: 120 },
];
const NET_EDGES: GraphEdge[] = [
  { from: 0, to: 1, weight: 2 }, { from: 0, to: 2, weight: 4 },
  { from: 1, to: 3, weight: 1 }, { from: 1, to: 2, weight: 1 },
  { from: 2, to: 4, weight: 3 }, { from: 3, to: 5, weight: 5 },
  { from: 4, to: 5, weight: 1 }, { from: 3, to: 4, weight: 2 },
];

function DijkstraViz({ state }: { state: DijkstraState }) {
  return (
    <svg width={500} height={250} style={{ display: 'block', margin: '8px 0' }}>
      {state.edges.map((e, i) => {
        const from = state.nodes.find(n => n.id === e.from)!;
        const to = state.nodes.find(n => n.id === e.to)!;
        const hl = state.relaxingEdge && ((state.relaxingEdge[0] === e.from && state.relaxingEdge[1] === e.to) || (state.relaxingEdge[0] === e.to && state.relaxingEdge[1] === e.from));
        return (
          <g key={i}>
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={hl ? '#ff4d4f' : '#ccc'} strokeWidth={hl ? 3 : 2} />
            <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 6} textAnchor="middle" fontSize={11} fill="#666">{e.weight}</text>
          </g>
        );
      })}
      {state.nodes.map((n) => (
        <g key={n.id}>
          <circle cx={n.x} cy={n.y} r={22}
            fill={n.id === state.current ? '#faad14' : state.visited.includes(n.id) ? '#52c41a' : '#fff'}
            stroke="#1677ff" strokeWidth={2} />
          <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize={12} fontWeight={600}
            fill={state.visited.includes(n.id) ? '#fff' : '#333'}>{n.id}</text>
          <text x={n.x} y={n.y + 38} textAnchor="middle" fontSize={10} fill="#888">
            {state.dist[n.id] === Infinity ? '∞' : state.dist[n.id]}
          </text>
        </g>
      ))}
    </svg>
  );
}

function TcpViz({ state }: { state: TcpState }) {
  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ textAlign: 'center', padding: '8px 16px', background: '#e6f7ff', borderRadius: 6 }}>
          <div style={{ fontSize: 12, color: '#888' }}>客户端</div>
          <div style={{ fontWeight: 600, color: '#1677ff' }}>{state.clientState}</div>
        </div>
        <div style={{ textAlign: 'center', padding: '8px 16px', background: '#f6ffed', borderRadius: 6 }}>
          <div style={{ fontSize: 12, color: '#888' }}>服务端</div>
          <div style={{ fontWeight: 600, color: '#52c41a' }}>{state.serverState}</div>
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {state.messages.map((m, i) => (
          <div key={i} style={{
            display: 'flex', justifyContent: m.from === 'client' ? 'flex-start' : 'flex-end',
            padding: '4px 12px',
          }}>
            <div style={{
              background: m.from === 'client' ? '#e6f7ff' : '#f6ffed',
              padding: '4px 12px', borderRadius: 4, fontSize: 13,
            }}>
              {m.from === 'client' ? '→' : '←'} {m.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NetDemo<S>({ steps, code, Viz }: { steps: { state: S; desc: string; lines?: number[] }[]; code: string; Viz: React.FC<{ state: S }> }) {
  const player = usePlayer(steps);
  return (
    <div>
      <Alert title={player.step.desc} type="info" showIcon style={{ marginBottom: 12 }} />
      <Viz state={player.step.state} />
      <Player player={player} />
      <CodePanel code={code} highlightLines={player.step.lines} />
    </div>
  );
}

export const NetView: React.FC = () => {
  const dijkstraSteps = useMemo(() => dijkstra(NET_NODES, NET_EDGES, 0), []);
  const tcpSteps = useMemo(() => tcpThreeWayHandshake(), []);

  return (
    <Tabs items={[
      { key: 'dijkstra', label: 'Dijkstra 最短路', children: <NetDemo steps={dijkstraSteps} code={dijkstraCode} Viz={DijkstraViz as React.FC<{ state: DijkstraState }>} /> },
      { key: 'tcp', label: 'TCP 三次握手', children: <NetDemo steps={tcpSteps} code={tcpCode} Viz={TcpViz as React.FC<{ state: TcpState }>} /> },
    ]} />
  );
};
