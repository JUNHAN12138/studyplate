import type { Step } from '../types';
import type { CircularQueueState } from './types';

export function circularQueueOps(
  capacity: number,
  operations: { op: 'enqueue' | 'dequeue'; value?: number }[]
): Step<CircularQueueState>[] {
  const steps: Step<CircularQueueState>[] = [];
  const buffer: (number | null)[] = Array(capacity).fill(null);
  let front = 0;
  let rear = 0;
  let size = 0;

  steps.push({
    state: { buffer: [...buffer], front, rear, size, capacity, action: '初始化' },
    desc: `初始化循环队列，容量 ${capacity}`,
    lines: [1],
  });

  for (const { op, value } of operations) {
    if (op === 'enqueue' && value !== undefined) {
      if (size === capacity) {
        steps.push({
          state: { buffer: [...buffer], front, rear, size, capacity, action: 'full' },
          desc: '队列已满，无法入队',
          lines: [3],
        });
      } else {
        buffer[rear] = value;
        rear = (rear + 1) % capacity;
        size++;
        steps.push({
          state: { buffer: [...buffer], front, rear, size, capacity, action: 'enqueue', value },
          desc: `enqueue(${value})，rear → ${rear}，size=${size}`,
          lines: [2, 3],
        });
      }
    } else if (op === 'dequeue') {
      if (size === 0) {
        steps.push({
          state: { buffer: [...buffer], front, rear, size, capacity, action: 'empty' },
          desc: '队列为空，无法出队',
          lines: [5],
        });
      } else {
        const val = buffer[front];
        buffer[front] = null;
        front = (front + 1) % capacity;
        size--;
        steps.push({
          state: { buffer: [...buffer], front, rear, size, capacity, action: 'dequeue', value: val ?? undefined },
          desc: `dequeue() → ${val}，front → ${front}，size=${size}`,
          lines: [4, 5],
        });
      }
    }
  }

  steps.push({
    state: { buffer: [...buffer], front, rear, size, capacity, action: '完成' },
    desc: `操作完成，队列 size=${size}`,
    lines: [6],
  });
  return steps;
}

export const circularQueueCode = `class CircularQueue {
  constructor(k) { this.buf=Array(k); this.f=0; this.r=0; this.sz=0; this.cap=k; } // 1
  enqueue(val) {                            // 2
    if (this.isFull()) return false;        // 3
    this.buf[this.r]=val; this.r=(this.r+1)%this.cap; this.sz++;
  }
  dequeue() {                               // 4
    if (this.isEmpty()) return undefined;   // 5
    const v=this.buf[this.f]; this.buf[this.f]=null; this.f=(this.f+1)%this.cap; this.sz--;
    return v;
  }                                         // 6
}`;
