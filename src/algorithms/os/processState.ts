import type { Step } from '../types';

export interface ProcessStateModel {
  states: string[];
  current: string;
  transitions: { from: string; to: string; label: string; highlighted: boolean }[];
}

const STATES = ['新建', '就绪', '运行', '阻塞', '终止'];
const TRANSITIONS = [
  { from: '新建', to: '就绪', label: '提交' },
  { from: '就绪', to: '运行', label: '调度' },
  { from: '运行', to: '就绪', label: '时间片完' },
  { from: '运行', to: '阻塞', label: 'I/O 请求' },
  { from: '阻塞', to: '就绪', label: 'I/O 完成' },
  { from: '运行', to: '终止', label: '完成' },
];

export function processStateDemo(): Step<ProcessStateModel>[] {
  const steps: Step<ProcessStateModel>[] = [];
  const sequence = [
    { from: '新建', to: '就绪', label: '提交' },
    { from: '就绪', to: '运行', label: '调度' },
    { from: '运行', to: '阻塞', label: 'I/O 请求' },
    { from: '阻塞', to: '就绪', label: 'I/O 完成' },
    { from: '就绪', to: '运行', label: '调度' },
    { from: '运行', to: '就绪', label: '时间片完' },
    { from: '就绪', to: '运行', label: '调度' },
    { from: '运行', to: '终止', label: '完成' },
  ];

  steps.push({
    state: {
      states: STATES,
      current: '新建',
      transitions: TRANSITIONS.map(t => ({ ...t, highlighted: false })),
    },
    desc: '进程处于「新建」状态',
    lines: [1],
  });

  for (const s of sequence) {
    steps.push({
      state: {
        states: STATES,
        current: s.to,
        transitions: TRANSITIONS.map(t => ({
          ...t,
          highlighted: t.from === s.from && t.to === s.to,
        })),
      },
      desc: `${s.from} → ${s.to}（${s.label}）`,
      lines: [2],
    });
  }

  return steps;
}

export const processStateCode = `进程状态转换模型:
新建 → 就绪（提交）               // 1
就绪 ↔ 运行（调度/时间片完）      // 2
运行 → 阻塞（I/O 请求）           // 3
阻塞 → 就绪（I/O 完成）           // 4
运行 → 终止（完成）               // 5`;
