import React, { useMemo } from 'react';
import { Tabs, Alert, Typography } from 'antd';
import { usePlayer } from '../../hooks/usePlayer';
import { Player } from '../../components/Player';
import type { Step } from '../../algorithms/types';

const { Title, Paragraph } = Typography;

interface DerivState {
  funcPoints: { x: number; y: number }[];
  tangentX: number;
  tangentSlope: number;
  deltaX: number;
  secantEnd?: number;
}

function derivSteps(fn: (x: number) => number, dfn: (x: number) => number, x0: number, label: string): Step<DerivState>[] {
  const steps: Step<DerivState>[] = [];
  const pts: { x: number; y: number }[] = [];
  for (let x = x0 - 3; x <= x0 + 3; x += 0.05) {
    const y = fn(x);
    if (isFinite(y)) pts.push({ x, y });
  }

  const deltas = [2, 1.5, 1, 0.5, 0.2, 0.1, 0.05, 0.01];
  const trueSlope = dfn(x0);

  steps.push({
    state: { funcPoints: pts, tangentX: x0, tangentSlope: trueSlope, deltaX: 2 },
    desc: `${label}，在 x=${x0} 处求导数`,
    lines: [1],
  });

  for (const dx of deltas) {
    const slope = (fn(x0 + dx) - fn(x0)) / dx;
    steps.push({
      state: { funcPoints: pts, tangentX: x0, tangentSlope: slope, deltaX: dx, secantEnd: x0 + dx },
      desc: `Δx = ${dx}: 割线斜率 = ${slope.toFixed(4)}，真实导数 = ${trueSlope.toFixed(4)}`,
      lines: [2],
    });
  }

  steps.push({
    state: { funcPoints: pts, tangentX: x0, tangentSlope: trueSlope, deltaX: 0 },
    desc: `Δx→0，切线斜率 f'(${x0}) = ${trueSlope.toFixed(4)}`,
    lines: [3],
  });
  return steps;
}

function DerivGraph({ state }: { state: DerivState }) {
  const width = 500;
  const height = 280;
  const margin = 40;
  const pts = state.funcPoints;
  if (pts.length === 0) return null;

  const minX = pts[0].x;
  const maxX = pts[pts.length - 1].x;
  const allY = pts.map(p => p.y);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  const rangeY = maxY - minY || 1;

  const sx = (x: number) => margin + ((x - minX) / (maxX - minX)) * (width - 2 * margin);
  const sy = (y: number) => height - margin - ((y - minY) / rangeY) * (height - 2 * margin);

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(' ');

  // Tangent line
  const tx = state.tangentX;
  const ty = pts.find(p => Math.abs(p.x - tx) < 0.06)?.y ?? 0;
  const tLen = 1.5;
  const tx1 = tx - tLen;
  const ty1 = ty - state.tangentSlope * tLen;
  const tx2 = tx + tLen;
  const ty2 = ty + state.tangentSlope * tLen;

  return (
    <svg width={width} height={height} style={{ display: 'block', margin: '8px 0', background: '#fafafa', borderRadius: 8 }}>
      <line x1={margin} y1={height - margin} x2={width - margin} y2={height - margin} stroke="#999" />
      <line x1={margin} y1={margin} x2={margin} y2={height - margin} stroke="#999" />
      <path d={pathD} fill="none" stroke="#1677ff" strokeWidth={2} />
      {/* Tangent / secant line */}
      <line x1={sx(tx1)} y1={sy(ty1)} x2={sx(tx2)} y2={sy(ty2)} stroke="#ff4d4f" strokeWidth={2} strokeDasharray={state.deltaX > 0.02 ? '6' : '0'} />
      <circle cx={sx(tx)} cy={sy(ty)} r={5} fill="#ff4d4f" />
      {state.secantEnd !== undefined && (
        <circle cx={sx(state.secantEnd)} cy={sy(pts.find(p => Math.abs(p.x - state.secantEnd!) < 0.06)?.y ?? 0)} r={4} fill="#faad14" />
      )}
    </svg>
  );
}

function DerivDemo({ steps }: { steps: Step<DerivState>[] }) {
  const player = usePlayer(steps);
  return (
    <div>
      <Alert title={player.step.desc} type="info" showIcon style={{ marginBottom: 12 }} />
      <DerivGraph state={player.step.state} />
      <Player player={player} />
    </div>
  );
}

export const DerivView: React.FC = () => {
  const x2Steps = useMemo(() => derivSteps(x => x * x, x => 2 * x, 1, 'f(x) = x²'), []);
  const sinSteps = useMemo(() => derivSteps(Math.sin, Math.cos, Math.PI / 4, 'f(x) = sin(x)'), []);

  return (
    <div>
      <Title level={4}>连续与导数</Title>
      <Paragraph>导数的几何意义：割线→切线（Δx→0），斜率趋近导数值</Paragraph>
      <Tabs items={[
        { key: 'x2', label: 'x²', children: <DerivDemo steps={x2Steps} /> },
        { key: 'sin', label: 'sin(x)', children: <DerivDemo steps={sinSteps} /> },
      ]} />
    </div>
  );
};
