import React, { useMemo } from 'react';
import { Tabs, Alert } from 'antd';
import { usePlayer } from '../hooks/usePlayer';
import { Player } from '../components/Player';
import { CodePanel } from '../components/CodePanel';
import { stackOps, stackCode } from '../algorithms/linear/stackOps';
import { queueOps, queueCode } from '../algorithms/linear/queueOps';
import { circularQueueOps, circularQueueCode } from '../algorithms/linear/circularQueue';
import type { StackState } from '../algorithms/linear/types';
import type { QueueState } from '../algorithms/linear/types';
import type { CircularQueueState } from '../algorithms/linear/types';

function StackViz({ state }: { state: StackState }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column-reverse', gap: 4, padding: '16px 0', minHeight: 150 }}>
      {state.stack.map((val, i) => (
        <div key={i} style={{
          width: 60, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: i === state.top ? '#1677ff' : '#bae7ff', borderRadius: 4, color: i === state.top ? '#fff' : '#000',
        }}>
          {val}
        </div>
      ))}
      {state.stack.length === 0 && <span style={{ color: '#999' }}>空栈</span>}
    </div>
  );
}

function QueueViz({ state }: { state: QueueState }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '16px 0', alignItems: 'center' }}>
      <span style={{ fontSize: 12, color: '#888' }}>front→</span>
      {state.queue.map((val, i) => (
        <div key={i} style={{
          width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#bae7ff', borderRadius: 4,
        }}>
          {val}
        </div>
      ))}
      <span style={{ fontSize: 12, color: '#888' }}>←rear</span>
      {state.queue.length === 0 && <span style={{ color: '#999' }}>空队列</span>}
    </div>
  );
}

function CircularQueueViz({ state }: { state: CircularQueueState }) {
  const radius = 80;
  const cx = 120;
  const cy = 120;
  return (
    <svg width={240} height={240} style={{ display: 'block', margin: '8px 0' }}>
      {state.buffer.map((val, i) => {
        const angle = (2 * Math.PI * i) / state.capacity - Math.PI / 2;
        const x = cx + radius * Math.cos(angle);
        const y = cy + radius * Math.sin(angle);
        let fill = '#f0f0f0';
        if (val !== null) fill = '#bae7ff';
        if (i === state.front && state.size > 0) fill = '#52c41a';
        if (i === ((state.rear - 1 + state.capacity) % state.capacity) && state.size > 0) fill = '#1677ff';
        return (
          <g key={i}>
            <circle cx={x} cy={y} r={20} fill={fill} stroke="#999" strokeWidth={1} />
            <text x={x} y={y + 5} textAnchor="middle" fontSize={12}>{val ?? ''}</text>
            <text x={x} y={y + 32} textAnchor="middle" fontSize={9} fill="#888">{i}</text>
          </g>
        );
      })}
      <text x={cx} y={cx} textAnchor="middle" fontSize={11} fill="#666">F={state.front} R={state.rear}</text>
    </svg>
  );
}

function LinearDemo<S>({ steps, code, Viz }: { steps: { state: S; desc: string; lines?: number[] }[]; code: string; Viz: React.FC<{ state: S }> }) {
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

const STACK_OPS = [
  { op: 'push' as const, value: 10 }, { op: 'push' as const, value: 20 },
  { op: 'push' as const, value: 30 }, { op: 'pop' as const }, { op: 'push' as const, value: 40 }, { op: 'pop' as const },
];
const QUEUE_OPS = [
  { op: 'enqueue' as const, value: 1 }, { op: 'enqueue' as const, value: 2 },
  { op: 'enqueue' as const, value: 3 }, { op: 'dequeue' as const }, { op: 'enqueue' as const, value: 4 }, { op: 'dequeue' as const },
];
const CQ_OPS = [
  { op: 'enqueue' as const, value: 10 }, { op: 'enqueue' as const, value: 20 },
  { op: 'enqueue' as const, value: 30 }, { op: 'dequeue' as const },
  { op: 'enqueue' as const, value: 40 }, { op: 'enqueue' as const, value: 50 },
  { op: 'dequeue' as const }, { op: 'enqueue' as const, value: 60 },
];

export const LinearView: React.FC = () => {
  const stackSteps = useMemo(() => stackOps(STACK_OPS), []);
  const queueSteps = useMemo(() => queueOps(QUEUE_OPS), []);
  const cqSteps = useMemo(() => circularQueueOps(5, CQ_OPS), []);

  return (
    <Tabs items={[
      { key: 'stack', label: '栈', children: <LinearDemo steps={stackSteps} code={stackCode} Viz={StackViz as React.FC<{ state: StackState }>} /> },
      { key: 'queue', label: '队列', children: <LinearDemo steps={queueSteps} code={queueCode} Viz={QueueViz as React.FC<{ state: QueueState }>} /> },
      { key: 'cq', label: '循环队列', children: <LinearDemo steps={cqSteps} code={circularQueueCode} Viz={CircularQueueViz as React.FC<{ state: CircularQueueState }>} /> },
    ]} />
  );
};
