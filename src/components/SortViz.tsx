import React from 'react';
import type { SortState } from '../algorithms/types';

interface Props {
  state: SortState;
}

const BAR_WIDTH = 36;
const MAX_HEIGHT = 200;

export const SortViz: React.FC<Props> = ({ state }) => {
  const { array, comparing, swapping, sorted, pivot } = state;
  const max = Math.max(...array, 1);

  const getColor = (i: number) => {
    if (pivot === i) return '#ff7875';
    if (swapping.includes(i)) return '#ff4d4f';
    if (comparing.includes(i)) return '#faad14';
    if (sorted.includes(i)) return '#52c41a';
    return '#1677ff';
  };

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: MAX_HEIGHT + 40, padding: '8px 0' }}>
      {array.map((val, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: 12, marginBottom: 2, color: '#333' }}>{val}</span>
          <div
            style={{
              width: BAR_WIDTH,
              height: (val / max) * MAX_HEIGHT,
              background: getColor(i),
              borderRadius: '4px 4px 0 0',
              transition: 'background 0.2s',
            }}
          />
          <span style={{ fontSize: 11, marginTop: 2, color: '#888' }}>{i}</span>
        </div>
      ))}
    </div>
  );
};
