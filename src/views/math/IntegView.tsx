import React, { useMemo } from 'react';
import { Tabs, Alert, Typography } from 'antd';
import { usePlayer } from '../../hooks/usePlayer';
import { Player } from '../../components/Player';
import type { Step } from '../../algorithms/types';

const { Title, Paragraph } = Typography;

interface IntegState {
  funcPoints: { x: number; y: number }[];
  rects: { x: number; width: number; height: number }[];
  n: number;
  area: number;
  a: number;
  b: number;
}

function riemannSteps(fn: (x: number) => number, a: number, b: number, label: string): Step<IntegState>[] {
  const steps: Step<IntegState>[] = [];
  const pts: { x: number; y: number }[] = [];
  for (let x = a - 0.5; x <= b + 0.5; x += 0.05) {
    pts.push({ x, y: fn(x) });
  }

  const nValues = [2, 4, 6, 8, 12, 16, 24, 32, 50];

  steps.push({
    state: { funcPoints: pts, rects: [], n: 0, area: 0, a, b },
    desc: `${label} 在 [${a}, ${b}] 上的定积分（黎曼和）`,
    lines: [1],
  });

  for (const n of nValues) {
    const dx = (b - a) / n;
    const rects: IntegState['rects'] = [];
    let area = 0;
    for (let i = 0; i < n; i++) {
      const xi = a + i * dx;
      const h = fn(xi + dx / 2); // midpoint rule
      rects.push({ x: xi, width: dx, height: h });
      area += h * dx;
    }
    steps.push({
      state: { funcPoints: pts, rects, n, area, a, b },
      desc: `n=${n}: 黎曼和 ≈ ${area.toFixed(4)}`,
      lines: [2],
    });
  }

  // Final
  let exactArea = 0;
  for (let i = 0; i < 1000; i++) { exactArea += fn(a + (i + 0.5) * (b - a) / 1000) * (b - a) / 1000; }
  steps.push({
    state: { funcPoints: pts, rects: [], n: Infinity, area: exactArea, a, b },
    desc: `n→∞ 时，定积分 ≈ ${exactArea.toFixed(4)}`,
    lines: [3],
  });
  return steps;
}

function RiemannGraph({ state }: { state: IntegState }) {
  const width = 500;
  const height = 280;
  const margin = 40;
  const pts = state.funcPoints;
  if (pts.length === 0) return null;

  const minX = pts[0].x;
  const maxX = pts[pts.length - 1].x;
  const allY = [...pts.map(p => p.y), ...state.rects.map(r => r.height), 0];
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  const sx = (x: number) => margin + ((x - minX) / rangeX) * (width - 2 * margin);
  const sy = (y: number) => height - margin - ((y - minY) / rangeY) * (height - 2 * margin);

  const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${sx(p.x).toFixed(1)},${sy(p.y).toFixed(1)}`).join(' ');
  const zeroY = sy(0);

  return (
    <svg width={width} height={height} style={{ display: 'block', margin: '8px 0', background: '#fafafa', borderRadius: 8 }}>
      <line x1={margin} y1={zeroY} x2={width - margin} y2={zeroY} stroke="#999" />
      <line x1={margin} y1={margin} x2={margin} y2={height - margin} stroke="#999" />
      {/* Rectangles */}
      {state.rects.map((r, i) => (
        <rect key={i} x={sx(r.x)} y={Math.min(sy(r.height), zeroY)} width={sx(r.x + r.width) - sx(r.x)}
          height={Math.abs(sy(r.height) - zeroY)} fill="rgba(22,119,255,0.2)" stroke="#1677ff" strokeWidth={0.5} />
      ))}
      {/* Function curve */}
      <path d={pathD} fill="none" stroke="#ff4d4f" strokeWidth={2} />
      {/* Area label */}
      <text x={width / 2} y={20} textAnchor="middle" fontSize={12} fill="#333">
        n={state.n === Infinity ? '∞' : state.n}，面积≈{state.area.toFixed(4)}
      </text>
    </svg>
  );
}

function IntegDemo({ steps }: { steps: Step<IntegState>[] }) {
  const player = usePlayer(steps);
  return (
    <div>
      <Alert title={player.step.desc} type="info" showIcon style={{ marginBottom: 12 }} />
      <RiemannGraph state={player.step.state} />
      <Player player={player} />
    </div>
  );
}

export const IntegView: React.FC = () => {
  const x2Steps = useMemo(() => riemannSteps(x => x * x, 0, 2, 'f(x) = x²'), []);
  const sinSteps = useMemo(() => riemannSteps(Math.sin, 0, Math.PI, 'f(x) = sin(x)'), []);

  return (
    <div>
      <Title level={4}>定积分与应用</Title>
      <Paragraph>黎曼和：将区间分为 n 个小矩形，n→∞ 时面积和趋近定积分</Paragraph>
      <Tabs items={[
        { key: 'x2', label: 'x²', children: <IntegDemo steps={x2Steps} /> },
        { key: 'sin', label: 'sin(x)', children: <IntegDemo steps={sinSteps} /> },
      ]} />
    </div>
  );
};
