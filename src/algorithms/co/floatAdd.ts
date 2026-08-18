import type { Step } from '../types';

export interface FloatState {
  step: string;
  expA: number;
  expB: number;
  mantA: string;
  mantB: string;
  result: string;
  desc: string;
}

export function floatAdd(a: number, b: number): Step<FloatState>[] {
  const steps: Step<FloatState>[] = [];

  // Simple float representation: sign + exponent + mantissa
  function decompose(v: number) {
    if (v === 0) return { sign: 0, exp: 0, mant: '0.000' };
    const sign = v < 0 ? 1 : 0;
    const abs = Math.abs(v);
    const exp = Math.floor(Math.log2(abs));
    const mant = abs / Math.pow(2, exp);
    return { sign, exp, mant: mant.toFixed(4) };
  }

  const da = decompose(a);
  const db = decompose(b);

  steps.push({
    state: { step: '分解', expA: da.exp, expB: db.exp, mantA: `${da.sign ? '-' : '+'}${da.mant}`, mantB: `${db.sign ? '-' : '+'}${db.mant}`, result: '', desc: '' },
    desc: `浮点加法: ${a} + ${b}，分解为 尾数×2^阶码`,
    lines: [1],
  });

  // Align exponents
  const maxExp = Math.max(da.exp, db.exp);
  const shiftA = maxExp - da.exp;
  const shiftB = maxExp - db.exp;
  const alignedA = (da.sign ? -1 : 1) * parseFloat(da.mant) / Math.pow(2, shiftA);
  const alignedB = (db.sign ? -1 : 1) * parseFloat(db.mant) / Math.pow(2, shiftB);

  steps.push({
    state: { step: '对阶', expA: maxExp, expB: maxExp, mantA: alignedA.toFixed(4), mantB: alignedB.toFixed(4), result: '', desc: '' },
    desc: `对阶：统一阶码为 ${maxExp}，小阶尾数右移`,
    lines: [2],
  });

  // Add mantissas
  const sumMant = alignedA + alignedB;
  steps.push({
    state: { step: '尾数运算', expA: maxExp, expB: maxExp, mantA: alignedA.toFixed(4), mantB: alignedB.toFixed(4), result: sumMant.toFixed(4), desc: '' },
    desc: `尾数相加: ${alignedA.toFixed(4)} + ${alignedB.toFixed(4)} = ${sumMant.toFixed(4)}`,
    lines: [3],
  });

  // Normalize
  let finalExp = maxExp;
  let finalMant = sumMant;
  if (finalMant !== 0) {
    while (Math.abs(finalMant) >= 2) { finalMant /= 2; finalExp++; }
    while (Math.abs(finalMant) < 1 && finalMant !== 0) { finalMant *= 2; finalExp--; }
  }

  steps.push({
    state: { step: '规格化', expA: finalExp, expB: finalExp, mantA: '', mantB: '', result: `${finalMant.toFixed(4)} × 2^${finalExp}`, desc: '' },
    desc: `规格化: ${finalMant.toFixed(4)} × 2^${finalExp}`,
    lines: [4],
  });

  const finalResult = finalMant * Math.pow(2, finalExp);
  steps.push({
    state: { step: '结果', expA: finalExp, expB: finalExp, mantA: '', mantB: '', result: `${finalResult}`, desc: '' },
    desc: `浮点加法结果: ${a} + ${b} = ${finalResult}`,
    lines: [5],
  });

  return steps;
}

export const floatAddCode = `function floatAdd(a, b) {
  decompose(a, b);          // 1: 分解为 符号+阶码+尾数
  alignExponents();         // 2: 对阶（小阶向大阶对齐）
  addMantissas();           // 3: 尾数相加
  normalize();              // 4: 规格化
  return result;            // 5: 得到最终结果
}`;
