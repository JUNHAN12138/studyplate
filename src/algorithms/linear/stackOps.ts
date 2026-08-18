import type { Step } from '../types';
import type { StackState } from './types';

export function stackOps(operations: { op: 'push' | 'pop'; value?: number }[]): Step<StackState>[] {
  const steps: Step<StackState>[] = [];
  const stack: number[] = [];

  steps.push({
    state: { stack: [], top: -1, action: '初始化空栈' },
    desc: '初始化空栈，top = -1',
    lines: [1],
  });

  for (const { op, value } of operations) {
    if (op === 'push' && value !== undefined) {
      stack.push(value);
      steps.push({
        state: { stack: [...stack], top: stack.length - 1, action: 'push', value },
        desc: `push(${value})，top → ${stack.length - 1}`,
        lines: [2, 3],
      });
    } else if (op === 'pop') {
      if (stack.length === 0) {
        steps.push({
          state: { stack: [], top: -1, action: 'pop-empty' },
          desc: '栈空，无法 pop',
          lines: [5],
        });
      } else {
        const val = stack.pop()!;
        steps.push({
          state: { stack: [...stack], top: stack.length - 1, action: 'pop', value: val },
          desc: `pop() → ${val}，top → ${stack.length - 1}`,
          lines: [4, 5],
        });
      }
    }
  }

  steps.push({
    state: { stack: [...stack], top: stack.length - 1, action: '完成' },
    desc: `操作完成，栈中剩余 ${stack.length} 个元素`,
    lines: [6],
  });
  return steps;
}

export const stackCode = `class Stack {
  constructor() { this.data = []; }       // 1
  push(val) { this.data.push(val); }      // 2,3
  pop() {                                  // 4
    if (this.isEmpty()) return undefined;  // 5
    return this.data.pop();
  }                                        // 6
}`;
