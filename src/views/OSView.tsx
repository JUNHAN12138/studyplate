import React, { useMemo } from 'react';
import { Tabs, Alert } from 'antd';
import { usePlayer } from '../hooks/usePlayer';
import { Player } from '../components/Player';
import { CodePanel } from '../components/CodePanel';
import { fcfs, sjf, roundRobin, scheduleCode } from '../algorithms/os/cpuSchedule';
import { processStateDemo, processStateCode } from '../algorithms/os/processState';
import type { ScheduleState } from '../algorithms/os/cpuSchedule';
import type { ProcessStateModel } from '../algorithms/os/processState';

const DEMO_PROCS = [
  { id: 'P1', arrival: 0, burst: 4 },
  { id: 'P2', arrival: 1, burst: 3 },
  { id: 'P3', arrival: 2, burst: 1 },
  { id: 'P4', arrival: 3, burst: 2 },
];

const COLORS: Record<string, string> = { P1: '#1677ff', P2: '#52c41a', P3: '#faad14', P4: '#ff4d4f' };

function GanttViz({ state }: { state: ScheduleState }) {
  const maxTime = Math.max(...state.gantt.map(g => g.end), 1);
  return (
    <div style={{ padding: '16px 0' }}>
      <div style={{ display: 'flex', gap: 0, height: 36, position: 'relative', border: '1px solid #d9d9d9', borderRadius: 4, overflow: 'hidden' }}>
        {state.gantt.map((g, i) => (
          <div key={i} style={{
            width: `${((g.end - g.start) / maxTime) * 100}%`, background: COLORS[g.id] ?? '#999',
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 12, fontWeight: 600,
          }}>
            {g.id}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', fontSize: 10, color: '#888', marginTop: 2 }}>
        {state.gantt.map((g, i) => (
          <div key={i} style={{ width: `${((g.end - g.start) / maxTime) * 100}%`, textAlign: 'left' }}>{g.start}</div>
        ))}
        <span>{state.gantt.length > 0 ? state.gantt[state.gantt.length - 1].end : 0}</span>
      </div>
    </div>
  );
}

function ProcessStateViz({ state }: { state: ProcessStateModel }) {
  const positions: Record<string, { x: number; y: number }> = {
    '新建': { x: 50, y: 100 }, '就绪': { x: 180, y: 100 },
    '运行': { x: 310, y: 100 }, '阻塞': { x: 245, y: 200 }, '终止': { x: 440, y: 100 },
  };
  return (
    <svg width={500} height={260} style={{ display: 'block', margin: '8px 0' }}>
      {state.transitions.map((t, i) => {
        const from = positions[t.from];
        const to = positions[t.to];
        return (
          <g key={i}>
            <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
              stroke={t.highlighted ? '#ff4d4f' : '#ccc'} strokeWidth={t.highlighted ? 3 : 1.5}
              markerEnd="url(#arrow)" />
            <text x={(from.x + to.x) / 2} y={(from.y + to.y) / 2 - 8}
              textAnchor="middle" fontSize={10} fill={t.highlighted ? '#ff4d4f' : '#666'}>{t.label}</text>
          </g>
        );
      })}
      {state.states.map((s) => {
        const p = positions[s];
        return (
          <g key={s}>
            <circle cx={p.x} cy={p.y} r={28}
              fill={s === state.current ? '#1677ff' : '#fff'} stroke="#1677ff" strokeWidth={2} />
            <text x={p.x} y={p.y + 5} textAnchor="middle" fontSize={12} fontWeight={600}
              fill={s === state.current ? '#fff' : '#333'}>{s}</text>
          </g>
        );
      })}
      <defs><marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#999" /></marker></defs>
    </svg>
  );
}

function OSDemo<S>({ steps, code, Viz }: { steps: { state: S; desc: string; lines?: number[] }[]; code: string; Viz: React.FC<{ state: S }> }) {
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

export const OSView: React.FC = () => {
  const fcfsSteps = useMemo(() => fcfs(DEMO_PROCS), []);
  const sjfSteps = useMemo(() => sjf(DEMO_PROCS), []);
  const rrSteps = useMemo(() => roundRobin(DEMO_PROCS, 2), []);
  const procSteps = useMemo(() => processStateDemo(), []);

  return (
    <Tabs items={[
      { key: 'fcfs', label: 'FCFS', children: <OSDemo steps={fcfsSteps} code={scheduleCode} Viz={GanttViz as React.FC<{ state: ScheduleState }>} /> },
      { key: 'sjf', label: 'SJF', children: <OSDemo steps={sjfSteps} code={scheduleCode} Viz={GanttViz as React.FC<{ state: ScheduleState }>} /> },
      { key: 'rr', label: 'RR', children: <OSDemo steps={rrSteps} code={scheduleCode} Viz={GanttViz as React.FC<{ state: ScheduleState }>} /> },
      { key: 'proc', label: '进程状态', children: <OSDemo steps={procSteps} code={processStateCode} Viz={ProcessStateViz as React.FC<{ state: ProcessStateModel }>} /> },
    ]} />
  );
};
