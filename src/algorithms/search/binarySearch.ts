import type { Step } from '../types';
import type { SearchState } from './types';

export function binarySearch(arr: number[], target: number): Step<SearchState>[] {
  const steps: Step<SearchState>[] = [];
  let low = 0;
  let high = arr.length - 1;
  const visited: number[] = [];

  steps.push({
    state: { array: arr, current: -1, found: false, target, low, high, mid: undefined, visited: [] },
    desc: `二分查找目标值 ${target}，数组已排序`,
    lines: [1],
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    visited.push(mid);

    if (arr[mid] === target) {
      steps.push({
        state: { array: arr, current: mid, found: true, target, low, high, mid, visited: [...visited] },
        desc: `mid=${mid}, arr[${mid}]=${arr[mid]} == ${target}，找到目标！`,
        lines: [4, 5],
      });
      return steps;
    } else if (arr[mid] < target) {
      steps.push({
        state: { array: arr, current: mid, found: false, target, low, high, mid, visited: [...visited] },
        desc: `mid=${mid}, arr[${mid}]=${arr[mid]} < ${target}，在右半区查找`,
        lines: [3, 6],
      });
      low = mid + 1;
    } else {
      steps.push({
        state: { array: arr, current: mid, found: false, target, low, high, mid, visited: [...visited] },
        desc: `mid=${mid}, arr[${mid}]=${arr[mid]} > ${target}，在左半区查找`,
        lines: [3, 7],
      });
      high = mid - 1;
    }
  }

  steps.push({
    state: { array: arr, current: -1, found: false, target, low, high, mid: undefined, visited: [...visited] },
    desc: `low > high，未找到 ${target}`,
    lines: [9],
  });
  return steps;
}

export const binarySearchCode = `function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1; // 1
  while (low <= high) {                // 2
    let mid = Math.floor((low+high)/2);// 3
    if (arr[mid] === target)           // 4
      return mid;                      // 5
    else if (arr[mid] < target)        // 6
      low = mid + 1;                   // 7
    else
      high = mid - 1;                  // 8
  }
  return -1;                           // 9
}`;
