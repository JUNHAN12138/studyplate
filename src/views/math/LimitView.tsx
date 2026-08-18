import React, { useMemo } from 'react';
import { Tabs, Alert, Typography } from 'antd';
import { usePlayer } from '../../hooks/usePlayer';
import { Player } from '../../components/Player';
import type { Step } from '../../algorithms/types';

const { Title, Paragraph } = Typography;

interface LimitState {
  funcName: string;
  points: { x: number; y: number }[];
  approachX?: number;
  approachY?: number;
  currentX?: number;
}

function generateFunctionPoints(fn: (x: number) => number, start: number, end: number, count: number): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  const step = (end - start) / count;
  for (let i = 0; i <= count; i++) {
    const x = start + step * i;
    const y = fn(x);
    if (isFinite(y)) pts.push({ x, y });
  }
  return pts;
}

function limitSteps(fn: (x: number) => number, target: number, label: string): Step<LimitState>[] {
  const steps: Step<LimitState>[] = [];
  const pts = generateFunctionPoints(fn, target - 3, target + 3, 100);
  const deltas = [2, 1, 0.5, 0.2, 0.1, 0.05, 0.01];

  steps.push({ state: { funcName: label, points: pts }, desc: `观察 f(x) 在 x→${target} 时的极限`, lines: [1] });

  for (const d of deltas) {
    const x = target - d;
    const y = fn(x);
    if (isFinite(y)) {
      steps.push({
        state: { funcName: label, points: pts, approachX: target, approachY: fn(target - 0.001), currentX: x },
        desc: `x = ${x.toFixed(4)} → f(x) = ${y.toFixed(4)}，逼近极限值`,
        lines: [2],
      });
    }
  }

  const limitVal = fn(target - 0.0001);
  steps.push({
    state: { funcName: label, points: pts, approachX: target, approachY: limitVal },
    desc: `极限 lim(x→${target}) f(x) ≈ ${limitVal.toFixed(4)}`,
    lines: [3],
  });
  return steps;
}

function FunctionGraph({ state }: { state: LimitState }) {
  const width = 500;
  const height = 250;
  const margin = 40;
  const pts = state.points;
  if (pts.length === 0) return null;

  const minX = pts[0].x;
  const maxX = pts[pts.length - 1].x;
  const minY = Math.min(...pts.map(p => p.y));
  const maxY = Math.max(...pts.map(p => p.y));
  const rangeY = maxY - minY || 1;

  const scaleX = (x: number) => margin + ((x - minX) / (maxX - minX)) * (width - 2 * margin);
  const scaleY = (y: number) => height - margin - ((y - minY) / rangeY) * (height - 2 * margin);

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${scaleX(p.x).toFixed(1)},${scaleY(p.y).toFixed(1)}`).join(' ');

  return (
    <svg width={width} height={height} style={{ display: 'block', margin: '8px 0', background: '#fafafa', borderRadius: 8 }}>
      {/* Axes */}
      <line x1={margin} y1={height - margin} x2={width - margin} y2={height - margin} stroke="#999" />
      <line x1={margin} y1={margin} x2={margin} y2={height - margin} stroke="#999" />
      {/* Function curve */}
      <path d={pathD} fill="none" stroke="#1677ff" strokeWidth={2} />
      {/* Approach point */}
      {state.currentX !== undefined && (
        <circle cx={scaleX(state.currentX)} cy={scaleY(pts.find(p => Math.abs(p.x - state.currentX!) < 0.1)?.y ?? 0)} r={5} fill="#ff4d4f" />
      )}
      {state.approachX !== undefined && state.approachY !== undefined && (
        <circle cx={scaleX(state.approachX)} cy={scaleY(state.approachY)} r={6} fill="none" stroke="#ff4d4f" strokeWidth={2} strokeDasharray="3" />
      )}
      <text x={width / 2} y={20} textAnchor="middle" fontSize={13} fill="#333">{state.funcName}</text>
    </svg>
  );
}

function LimitDemo({ steps }: { steps: Step<LimitState>[] }) {
  const player = usePlayer(steps);
  return (
    <div>
      <Alert title={player.step.desc} type="info" showIcon style={{ marginBottom: 12 }} />
      <FunctionGraph state={player.step.state} />
      <Player player={player} />
    </div>
  );
}

export const LimitView: React.FC = () => {
  const sinSteps = useMemo(() => limitSteps(Math.sin, 0, 'f(x) = sin(x), x→0'), []);
  const expSteps = useMemo(() => limitSteps(Math.exp, 0, 'f(x) = eˣ, x→0'), []);
  const logSteps = useMemo(() => limitSteps((x) => Math.log(Math.abs(x) + 0.001), 1, 'f(x) = ln(x), x→1'), []);

  return (
    <div>
      <Title level={4}>初等函数与极限</Title>
      <Paragraph>观察函数图像及极限过程（x→a 时 f(x) 的趋势）</Paragraph>
      <Tabs items={[
        { key: 'sin', label: 'sin(x)', children: <LimitDemo steps={sinSteps} /> },
        { key: 'exp', label: 'eˣ', children: <LimitDemo steps={expSteps} /> },
        { key: 'log', label: 'ln(x)', children: <LimitDemo steps={logSteps} /> },
      ]} />
    </div>
  );
};
