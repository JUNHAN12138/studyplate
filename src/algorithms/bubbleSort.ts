import type { Step, SortState } from './types';

export function bubbleSort(input: number[]): Step<SortState>[] {
  const steps: Step<SortState>[] = [];
  const arr = [...input];
  const n = arr.length;
  const sorted: number[] = [];

  const snap = (comparing: number[], swapping: number[], desc: string, lines: number[], pivot?: number) => {
    steps.push({
      state: { array: [...arr], comparing, swapping, sorted: [...sorted], pivot },
      desc,
      lines,
    });
  };

  snap([], [], `开始冒泡排序，数组长度 ${n}`, [1]);

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      snap([j, j + 1], [], `比较 arr[${j}]=${arr[j]} 与 arr[${j + 1}]=${arr[j + 1]}`, [4, 5]);
      if (arr[j] > arr[j + 1]) {
        snap([j, j + 1], [j, j + 1], `arr[${j}]=${arr[j]} > arr[${j + 1}]=${arr[j + 1]}，交换`, [6, 7]);
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        snap([j, j + 1], [], `交换完成`, [7]);
      }
    }
    sorted.unshift(n - 1 - i);
    snap([], [], `第 ${i + 1} 轮完成，arr[${n - 1 - i}]=${arr[n - 1 - i]} 已归位`, [3]);
  }
  sorted.unshift(0);
  snap([], [], '冒泡排序完成', [10]);
  return steps;
}

export const bubbleSortCode = `function bubbleSort(arr) {
  const n = arr.length;               // 1
  for (let i = 0; i < n-1; i++) {    // 2
    for (let j = 0; j < n-1-i; j++){// 3
      if (arr[j] > arr[j+1]) {       // 4,5
        [arr[j],arr[j+1]] =          // 6
          [arr[j+1],arr[j]];         // 7
      }
    }                                  // 8
  }                                    // 9
  return arr;                          // 10
}`;
