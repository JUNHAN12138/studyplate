import React from 'react';

interface Props {
  code: string;
  highlightLines?: number[];
}

export const CodePanel: React.FC<Props> = ({ code, highlightLines = [] }) => {
  const lines = code.split('\n');
  return (
    <pre
      style={{
        margin: 0,
        padding: '8px 12px',
        background: '#1e1e1e',
        borderRadius: 8,
        overflowX: 'auto',
        fontSize: 13,
        lineHeight: '22px',
      }}
    >
      {lines.map((line, i) => {
        // Extract line number comment at end like // 1 or // 4,5
        const lineNums = line.match(/\/\/ (\d+(?:,\d+)*)\s*$/);
        const nums = lineNums ? lineNums[1].split(',').map(Number) : [];
        const highlighted = nums.some((n) => highlightLines.includes(n));
        return (
          <div
            key={i}
            style={{
              background: highlighted ? 'rgba(255,215,0,0.18)' : 'transparent',
              borderLeft: highlighted ? '3px solid #faad14' : '3px solid transparent',
              paddingLeft: 6,
              borderRadius: 2,
            }}
          >
            <span style={{ color: '#666', marginRight: 12, userSelect: 'none', fontSize: 11 }}>
              {String(i + 1).padStart(2, ' ')}
            </span>
            <span style={{ color: '#d4d4d4', whiteSpace: 'pre' }}>{line}</span>
          </div>
        );
      })}
    </pre>
  );
};
