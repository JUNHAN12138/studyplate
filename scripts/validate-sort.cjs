// Validate sort algorithms output correct results
// Run: node --experimental-vm-modules scripts/validate-sort.cjs
// Or compile with tsc first

// Pure JS validation (no imports needed - copy logic inline)
function bubbleSort(input) {
  const arr = [...input];
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      if (arr[j] > arr[j + 1]) [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
    }
  }
  return arr;
}

function insertionSort(input) {
  const arr = [...input];
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > key) { arr[j + 1] = arr[j]; j--; }
    arr[j + 1] = key;
  }
  return arr;
}

function quickSort(input) {
  const arr = [...input];
  function partition(low, high) {
    const pivot = arr[high];
    let i = low - 1;
    for (let j = low; j < high; j++) {
      if (arr[j] <= pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return i + 1;
  }
  function qsort(low, high) {
    if (low < high) { const p = partition(low, high); qsort(low, p - 1); qsort(p + 1, high); }
  }
  qsort(0, arr.length - 1);
  return arr;
}

const DEMO = [5, 3, 8, 1, 9, 2, 7, 4, 6];
const EXPECTED = [...DEMO].sort((a, b) => a - b).join(',');
let passed = 0, failed = 0;

function check(name, result) {
  const r = result.join(',');
  if (r === EXPECTED) { console.log(`✅ ${name}: [${r}]`); passed++; }
  else { console.error(`❌ ${name}: got [${r}], expected [${EXPECTED}]`); failed++; }
}

check('BubbleSort', bubbleSort(DEMO));
check('InsertionSort', insertionSort(DEMO));
check('QuickSort', quickSort(DEMO));

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
