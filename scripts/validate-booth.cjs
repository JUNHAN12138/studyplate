// Validate Booth multiplication
function boothMultiply(multiplicand, multiplier, bits) {
  const n = bits;
  function toTwos(val, b) {
    if (val >= 0) return val.toString(2).padStart(b, '0');
    return ((1 << b) + val).toString(2).padStart(b, '0');
  }
  function fromTwos(s) {
    const val = parseInt(s, 2);
    if (s[0] === '1') return val - (1 << s.length);
    return val;
  }
  function addBin(a, b) {
    let carry = 0, result = '';
    for (let i = a.length - 1; i >= 0; i--) {
      const s = parseInt(a[i]) + parseInt(b[i]) + carry;
      result = (s % 2) + result; carry = Math.floor(s / 2);
    }
    return result;
  }
  function negateBin(s) {
    const flipped = s.split('').map(c => c === '0' ? '1' : '0').join('');
    return addBin(flipped, '0'.repeat(s.length - 1) + '1');
  }

  let A = '0'.repeat(n), Q = toTwos(multiplier, n), Q_1 = '0';
  const M = toTwos(multiplicand, n);
  let count = n;

  while (count > 0) {
    const qn = Q[Q.length - 1];
    if (qn === '1' && Q_1 === '0') A = addBin(A, negateBin(M));
    else if (qn === '0' && Q_1 === '1') A = addBin(A, M);
    // ASR
    const newQ1 = Q[Q.length - 1];
    Q = A[A.length - 1] + Q.slice(0, -1);
    A = A[0] + A.slice(0, -1);
    Q_1 = newQ1;
    count--;
  }
  return fromTwos(A + Q);
}

let passed = 0, failed = 0;
function check(name, result, expected) {
  if (result === expected) { console.log(`✅ ${name}: ${result}`); passed++; }
  else { console.error(`❌ ${name}: got ${result}, expected ${expected}`); failed++; }
}

check('Booth 3×(-4)', boothMultiply(3, -4, 4), -12);
check('Booth 2×3', boothMultiply(2, 3, 4), 6);
check('Booth (-3)×(-2)', boothMultiply(-3, -2, 4), 6);
check('Booth 7×1', boothMultiply(7, 1, 4), 7);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
