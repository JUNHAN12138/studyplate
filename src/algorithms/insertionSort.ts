import type { Step, SortState } from './types';

export function insertionSort(input: number[]): Step<SortState>[] {
  const steps: Step<SortState>[] = [];
  const arr = [...input];
  const n = arr.length;
  const sorted: number[] = [0];

  const snap = (comparing: number[], swapping: number[], desc: string, lines: number[]) => {
    steps.push({ state: { array: [...arr], comparing, swapping, sorted: [...sorted] }, desc, lines });
  };

  snap([], [], `开始插入排序，数组长度 ${n}`, [1]);

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    snap([i], [], `取出 key = arr[${i}] = ${key}`, [3, 4]);
    let j = i - 1;
    while (j >= 0 && arr[j] > key) {
      snap([j, j + 1], [j, j + 1], `arr[${j}]=${arr[j]} > key=${key}，后移`, [5, 6]);
      arr[j + 1] = arr[j];
      j--;
      snap([j + 1, j + 2], [], `后移完成`, [6]);
    }
    arr[j + 1] = key;
    sorted.push(i);
    snap([], [], `key=${key} 插入到位置 ${j + 1}`, [7]);
  }
  snap([], [], '插入排序完成', [9]);
  return steps;
}

export const insertionSortCode = `function insertionSort(arr) {
  const n = arr.length;              // 1
  for (let i = 1; i < n; i++) {     // 2
    const key = arr[i];             // 3, 4
    let j = i - 1;
    while (j >= 0 && arr[j] > key){ // 5
      arr[j+1] = arr[j]; j--;       // 6
    }
    arr[j+1] = key;                  // 7
  }                                   // 8
  return arr;                         // 9
}`;
