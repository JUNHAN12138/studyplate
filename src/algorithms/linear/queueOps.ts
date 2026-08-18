import type { Step } from '../types';
import type { QueueState } from './types';

export function queueOps(operations: { op: 'enqueue' | 'dequeue'; value?: number }[]): Step<QueueState>[] {
  const steps: Step<QueueState>[] = [];
  const queue: number[] = [];

  steps.push({
    state: { queue: [], front: 0, rear: 0, action: '初始化空队列' },
    desc: '初始化空队列',
    lines: [1],
  });

  for (const { op, value } of operations) {
    if (op === 'enqueue' && value !== undefined) {
      queue.push(value);
      steps.push({
        state: { queue: [...queue], front: 0, rear: queue.length, action: 'enqueue', value },
        desc: `enqueue(${value})，rear → ${queue.length}`,
        lines: [2, 3],
      });
    } else if (op === 'dequeue') {
      if (queue.length === 0) {
        steps.push({
          state: { queue: [], front: 0, rear: 0, action: 'dequeue-empty' },
          desc: '队列空，无法 dequeue',
          lines: [5],
        });
      } else {
        const val = queue.shift()!;
        steps.push({
          state: { queue: [...queue], front: 0, rear: queue.length, action: 'dequeue', value: val },
          desc: `dequeue() → ${val}`,
          lines: [4, 5],
        });
      }
    }
  }

  steps.push({
    state: { queue: [...queue], front: 0, rear: queue.length, action: '完成' },
    desc: `操作完成，队列中剩余 ${queue.length} 个元素`,
    lines: [6],
  });
  return steps;
}

export const queueCode = `class Queue {
  constructor() { this.data = []; }           // 1
  enqueue(val) { this.data.push(val); }       // 2,3
  dequeue() {                                  // 4
    if (this.isEmpty()) return undefined;      // 5
    return this.data.shift();
  }                                            // 6
}`;
