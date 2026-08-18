import React, { useMemo } from 'react';
import { Tabs, Alert } from 'antd';
import { usePlayer } from '../hooks/usePlayer';
import { Player } from '../components/Player';
import { SortViz } from '../components/SortViz';
import { CodePanel } from '../components/CodePanel';
import { bubbleSort, bubbleSortCode } from '../algorithms/bubbleSort';
import { insertionSort, insertionSortCode } from '../algorithms/insertionSort';
import { quickSort, quickSortCode } from '../algorithms/quickSort';

const DEMO = [5, 3, 8, 1, 9, 2, 7, 4, 6];

function SortDemo({
  steps,
  code,
}: {
  steps: ReturnType<typeof bubbleSort>;
  code: string;
}) {
  const player = usePlayer(steps);
  return (
    <div>
      <Alert
        title={player.step.desc}
        type="info"
        showIcon
        style={{ marginBottom: 12 }}
      />
      <SortViz state={player.step.state} />
      <Player player={player} />
      <div style={{ marginTop: 12 }}>
        <CodePanel code={code} highlightLines={player.step.lines} />
      </div>
    </div>
  );
}

export const SortView: React.FC = () => {
  const bubbleSteps = useMemo(() => bubbleSort(DEMO), []);
  const insertionSteps = useMemo(() => insertionSort(DEMO), []);
  const quickSteps = useMemo(() => quickSort(DEMO), []);

  return (
    <Tabs
      items={[
        {
          key: 'bubble',
          label: '冒泡排序',
          children: <SortDemo steps={bubbleSteps} code={bubbleSortCode} />,
        },
        {
          key: 'insertion',
          label: '插入排序',
          children: <SortDemo steps={insertionSteps} code={insertionSortCode} />,
        },
        {
          key: 'quick',
          label: '快速排序',
          children: <SortDemo steps={quickSteps} code={quickSortCode} />,
        },
      ]}
    />
  );
};
