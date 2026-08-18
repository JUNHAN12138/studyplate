import React, { useMemo } from 'react';
import { Tabs, Alert } from 'antd';
import { usePlayer } from '../hooks/usePlayer';
import { Player } from '../components/Player';
import { CodePanel } from '../components/CodePanel';
import { boothMultiply, boothCode } from '../algorithms/co/booth';
import { floatAdd, floatAddCode } from '../algorithms/co/floatAdd';
import type { BoothState } from '../algorithms/co/booth';
import type { FloatState } from '../algorithms/co/floatAdd';

function BoothViz({ state }: { state: BoothState }) {
  return (
    <div style={{ padding: '16px 0' }}>
      <table style={{ borderCollapse: 'collapse', fontSize: 14, fontFamily: 'monospace' }}>
        <thead>
          <tr>
            {['A', 'Q', 'Q₋₁', 'M', 'Count', '操作'].map(h => (
              <th key={h} style={{ padding: '4px 12px', borderBottom: '2px solid #1677ff', textAlign: 'center' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '4px 12px', textAlign: 'center', background: '#f6ffed' }}>{state.A}</td>
            <td style={{ padding: '4px 12px', textAlign: 'center', background: '#f6ffed' }}>{state.Q}</td>
            <td style={{ padding: '4px 12px', textAlign: 'center' }}>{state.Q_1}</td>
            <td style={{ padding: '4px 12px', textAlign: 'center' }}>{state.M}</td>
            <td style={{ padding: '4px 12px', textAlign: 'center' }}>{state.count}</td>
            <td style={{ padding: '4px 12px', textAlign: 'center', color: '#1677ff' }}>{state.action}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function FloatViz({ state }: { state: FloatState }) {
  return (
    <div style={{ padding: '16px 0' }}>
      <table style={{ borderCollapse: 'collapse', fontSize: 14 }}>
        <tbody>
          <tr><td style={{ padding: '4px 12px', fontWeight: 600 }}>步骤</td><td style={{ padding: '4px 12px' }}>{state.step}</td></tr>
          <tr><td style={{ padding: '4px 12px', fontWeight: 600 }}>阶码A / 阶码B</td><td style={{ padding: '4px 12px' }}>{state.expA} / {state.expB}</td></tr>
          {state.mantA && <tr><td style={{ padding: '4px 12px', fontWeight: 600 }}>尾数A</td><td style={{ padding: '4px 12px' }}>{state.mantA}</td></tr>}
          {state.mantB && <tr><td style={{ padding: '4px 12px', fontWeight: 600 }}>尾数B</td><td style={{ padding: '4px 12px' }}>{state.mantB}</td></tr>}
          {state.result && <tr><td style={{ padding: '4px 12px', fontWeight: 600 }}>结果</td><td style={{ padding: '4px 12px', color: '#1677ff' }}>{state.result}</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function CODemo<S>({ steps, code, Viz }: { steps: { state: S; desc: string; lines?: number[] }[]; code: string; Viz: React.FC<{ state: S }> }) {
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

export const COView: React.FC = () => {
  const boothSteps = useMemo(() => boothMultiply(3, -4, 4), []);
  const floatSteps = useMemo(() => floatAdd(5.5, 2.75), []);

  return (
    <Tabs items={[
      { key: 'booth', label: 'Booth 乘法', children: <CODemo steps={boothSteps} code={boothCode} Viz={BoothViz as React.FC<{ state: BoothState }>} /> },
      { key: 'float', label: '浮点加减', children: <CODemo steps={floatSteps} code={floatAddCode} Viz={FloatViz as React.FC<{ state: FloatState }>} /> },
    ]} />
  );
};
