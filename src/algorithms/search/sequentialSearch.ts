import type { Step } from '../types';
import type { SearchState } from './types';

export function sequentialSearch(arr: number[], target: number): Step<SearchState>[] {
  const steps: Step<SearchState>[] = [];
  const visited: number[] = [];

  steps.push({
    state: { array: arr, current: -1, found: false, target, visited: [] },
    desc: `顺序查找目标值 ${target}，从头开始逐个比较`,
    lines: [1],
  });

  for (let i = 0; i < arr.length; i++) {
    visited.push(i);
    if (arr[i] === target) {
      steps.push({
        state: { array: arr, current: i, found: true, target, visited: [...visited] },
        desc: `arr[${i}]=${arr[i]} == ${target}，找到目标！`,
        lines: [3, 4],
      });
      return steps;
    }
    steps.push({
      state: { array: arr, current: i, found: false, target, visited: [...visited] },
      desc: `arr[${i}]=${arr[i]} ≠ ${target}，继续`,
      lines: [2, 3],
    });
  }

  steps.push({
    state: { array: arr, current: -1, found: false, target, visited: [...visited] },
    desc: `遍历完毕，未找到 ${target}`,
    lines: [6],
  });
  return steps;
}

export const sequentialSearchCode = `function sequentialSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) { // 1
    if (arr[i] === target) {              // 2,3
      return i; // 找到                    // 4
    }
  }                                        // 5
  return -1; // 未找到                      // 6
}`;
