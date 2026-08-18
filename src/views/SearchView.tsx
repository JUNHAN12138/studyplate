import React, { useMemo } from 'react';
import { Tabs, Alert } from 'antd';
import { usePlayer } from '../hooks/usePlayer';
import { Player } from '../components/Player';
import { CodePanel } from '../components/CodePanel';
import { sequentialSearch, sequentialSearchCode } from '../algorithms/search/sequentialSearch';
import { binarySearch, binarySearchCode } from '../algorithms/search/binarySearch';
import type { SearchState } from '../algorithms/search/types';

const DEMO_ARR = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const TARGET = 7;

function SearchViz({ state }: { state: SearchState }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '16px 0', flexWrap: 'wrap' }}>
      {state.array.map((val, i) => {
        let bg = '#f0f0f0';
        let border = '2px solid transparent';
        if (state.found && state.current === i) { bg = '#52c41a'; border = '2px solid #389e0d'; }
        else if (state.current === i) { bg = '#faad14'; border = '2px solid #d48806'; }
        else if (state.visited.includes(i)) { bg = '#bae7ff'; }
        if (state.low !== undefined && state.high !== undefined) {
          if (i < state.low || i > state.high) bg = '#f5f5f5';
        }
        return (
          <div key={i} style={{
            width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: bg, border, borderRadius: 6, fontSize: 14, fontWeight: 500,
          }}>
            {val}
          </div>
        );
      })}
    </div>
  );
}

function SearchDemo({ steps, code }: { steps: ReturnType<typeof sequentialSearch>; code: string }) {
  const player = usePlayer(steps);
  return (
    <div>
      <Alert title={player.step.desc} type="info" showIcon style={{ marginBottom: 12 }} />
      <SearchViz state={player.step.state} />
      <Player player={player} />
      <CodePanel code={code} highlightLines={player.step.lines} />
    </div>
  );
}

export const SearchView: React.FC = () => {
  const seqSteps = useMemo(() => sequentialSearch(DEMO_ARR, TARGET), []);
  const binSteps = useMemo(() => binarySearch(DEMO_ARR, TARGET), []);

  return (
    <Tabs items={[
      { key: 'seq', label: '顺序查找', children: <SearchDemo steps={seqSteps} code={sequentialSearchCode} /> },
      { key: 'bin', label: '二分查找', children: <SearchDemo steps={binSteps} code={binarySearchCode} /> },
    ]} />
  );
};
