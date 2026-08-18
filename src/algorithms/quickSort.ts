import type { Step, SortState } from './types';

export function quickSort(input: number[]): Step<SortState>[] {
  const steps: Step<SortState>[] = [];
  const arr = [...input];
  const sorted: number[] = [];

  const snap = (comparing: number[], swapping: number[], desc: string, lines: number[], pivot?: number) => {
    steps.push({ state: { array: [...arr], comparing, swapping, sorted: [...sorted], pivot }, desc, lines });
  };

  snap([], [], `开始快速排序，数组长度 ${arr.length}`, [1]);

  function partition(low: number, high: number): number {
    const pivotVal = arr[high];
    snap([high], [], `选取基准 pivot = arr[${high}] = ${pivotVal}`, [3, 4], high);
    let i = low - 1;
    for (let j = low; j < high; j++) {
      snap([j, high], [], `比较 arr[${j}]=${arr[j]} 与 pivot=${pivotVal}`, [5, 6], high);
      if (arr[j] <= pivotVal) {
        i++;
        snap([i, j], [i, j], `arr[${j}]=${arr[j]} <= pivot，交换 arr[${i}] 与 arr[${j}]`, [7, 8], high);
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
    }
    snap([i + 1, high], [i + 1, high], `基准归位：交换 arr[${i + 1}] 与 arr[${high}]`, [9, 10], high);
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    sorted.push(i + 1);
    snap([], [], `基准 ${pivotVal} 归位到索引 ${i + 1}`, [11], i + 1);
    return i + 1;
  }

  function qsort(low: number, high: number) {
    if (low < high) {
      const p = partition(low, high);
      qsort(low, p - 1);
      qsort(p + 1, high);
    } else if (low === high) {
      sorted.push(low);
    }
  }

  qsort(0, arr.length - 1);
  snap([], [], '快速排序完成', [13]);
  return steps;
}

export const quickSortCode = `function quickSort(arr, low, high) {// 1
  if (low < high) {                   // 2
    const p = partition(arr,          // 3
      low, high);                     // 4
    quickSort(arr, low, p-1);         // 5
    quickSort(arr, p+1, high);        // 6
  }
}
function partition(arr, low, high) {  // 7
  const pivot = arr[high];            // 8
  let i = low - 1;
  for (let j = low; j < high; j++) { // 9
    if (arr[j] <= pivot) {            // 10
      i++; swap(arr, i, j);          // 11
    }
  }
  swap(arr, i+1, high);              // 12
  return i+1;                         // 13
}`;
