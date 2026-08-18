import type { Step } from '../types';

export interface BoothState {
  A: string;
  Q: string;
  Q_1: string;
  M: string;
  count: number;
  action: string;
}

export function boothMultiply(multiplicand: number, multiplier: number, bits: number = 4): Step<BoothState>[] {
  const steps: Step<BoothState>[] = [];
  const n = bits;

  function toTwos(val: number, b: number): string {
    if (val >= 0) return val.toString(2).padStart(b, '0');
    return ((1 << b) + val).toString(2).padStart(b, '0');
  }

  function fromTwos(s: string): number {
    const val = parseInt(s, 2);
    if (s[0] === '1') return val - (1 << s.length);
    return val;
  }

  function asr(a: string, q: string, _q1: string): [string, string, string] {
    const newQ1 = q[q.length - 1];
    const newQ = a[a.length - 1] + q.slice(0, -1);
    const newA = a[0] + a.slice(0, -1);
    return [newA, newQ, newQ1];
  }

  function addBin(a: string, b: string): string {
    let carry = 0;
    let result = '';
    for (let i = a.length - 1; i >= 0; i--) {
      const s = parseInt(a[i]) + parseInt(b[i]) + carry;
      result = (s % 2) + result;
      carry = Math.floor(s / 2);
    }
    return result;
  }

  function negateBin(s: string): string {
    const flipped = s.split('').map((c) => (c === '0' ? '1' : '0')).join('');
    return addBin(flipped, '0'.repeat(s.length - 1) + '1');
  }

  let A = '0'.repeat(n);
  let Q = toTwos(multiplier, n);
  let Q_1 = '0';
  const M = toTwos(multiplicand, n);
  let count = n;

  steps.push({
    state: { A, Q, Q_1, M, count, action: '初始化' },
    desc: `Booth 乘法: ${multiplicand} × ${multiplier}，初始化寄存器`,
    lines: [1],
  });

  while (count > 0) {
    const qn = Q[Q.length - 1];
    if (qn === '1' && Q_1 === '0') {
      A = addBin(A, negateBin(M));
      steps.push({
        state: { A, Q, Q_1, M, count, action: 'A = A - M' },
        desc: `Q₀Q₋₁=10 → A = A - M`,
        lines: [3],
      });
    } else if (qn === '0' && Q_1 === '1') {
      A = addBin(A, M);
      steps.push({
        state: { A, Q, Q_1, M, count, action: 'A = A + M' },
        desc: `Q₀Q₋₁=01 → A = A + M`,
        lines: [4],
      });
    } else {
      steps.push({
        state: { A, Q, Q_1, M, count, action: '无操作' },
        desc: `Q₀Q₋₁=${qn}${Q_1} → 无算术操作`,
        lines: [5],
      });
    }

    [A, Q, Q_1] = asr(A, Q, Q_1);
    count--;
    steps.push({
      state: { A, Q, Q_1, M, count, action: '算术右移' },
      desc: `算术右移，count=${count}`,
      lines: [6],
    });
  }

  const result = fromTwos(A + Q);
  steps.push({
    state: { A, Q, Q_1, M, count, action: '完成' },
    desc: `Booth 乘法完成: ${multiplicand} × ${multiplier} = ${result}`,
    lines: [7],
  });
  return steps;
}

export const boothCode = `function booth(M, Q, n) {
  let A = "0".repeat(n), Q_1 = "0";    // 1
  for (let count = n; count > 0; count--) { // 2
    if (Q[n-1]=="1" && Q_1=="0") A -= M;// 3
    else if (Q[n-1]=="0" && Q_1=="1") A += M; // 4
    // else: no operation                // 5
    ASR(A, Q, Q_1);                     // 6
  }
  return A + Q; // 结果                  // 7
}`;
