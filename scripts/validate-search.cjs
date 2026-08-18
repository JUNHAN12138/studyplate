// Validate search algorithms
function sequentialSearch(arr, target) {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === target) return i;
  }
  return -1;
}

function binarySearch(arr, target) {
  let low = 0, high = arr.length - 1;
  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] === target) return mid;
    else if (arr[mid] < target) low = mid + 1;
    else high = mid - 1;
  }
  return -1;
}

const ARR = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
let passed = 0, failed = 0;

function check(name, result, expected) {
  if (result === expected) { console.log(`✅ ${name}: ${result}`); passed++; }
  else { console.error(`❌ ${name}: got ${result}, expected ${expected}`); failed++; }
}

check('Sequential found', sequentialSearch(ARR, 7), 3);
check('Sequential not found', sequentialSearch(ARR, 8), -1);
check('Binary found', binarySearch(ARR, 7), 3);
check('Binary not found', binarySearch(ARR, 8), -1);
check('Binary first', binarySearch(ARR, 1), 0);
check('Binary last', binarySearch(ARR, 19), 9);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
