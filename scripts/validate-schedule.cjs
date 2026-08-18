// Validate CPU scheduling algorithms
function fcfs(processes) {
  const sorted = [...processes].sort((a, b) => a.arrival - b.arrival);
  let time = 0;
  const results = [];
  for (const p of sorted) {
    if (time < p.arrival) time = p.arrival;
    results.push({ id: p.id, start: time, end: time + p.burst });
    time += p.burst;
  }
  return results;
}

function sjf(processes) {
  const remaining = [...processes].sort((a, b) => a.arrival - b.arrival);
  const results = [];
  let time = 0;
  while (remaining.length > 0) {
    const ready = remaining.filter(p => p.arrival <= time);
    if (ready.length === 0) { time = remaining[0].arrival; continue; }
    ready.sort((a, b) => a.burst - b.burst);
    const p = ready[0];
    remaining.splice(remaining.indexOf(p), 1);
    results.push({ id: p.id, start: time, end: time + p.burst });
    time += p.burst;
  }
  return results;
}

const PROCS = [
  { id: 'P1', arrival: 0, burst: 4 },
  { id: 'P2', arrival: 1, burst: 3 },
  { id: 'P3', arrival: 2, burst: 1 },
  { id: 'P4', arrival: 3, burst: 2 },
];

let passed = 0, failed = 0;
function check(name, result, expectedTotal) {
  const total = result[result.length - 1].end;
  if (total === expectedTotal) { console.log(`✅ ${name}: total=${total}`); passed++; }
  else { console.error(`❌ ${name}: total=${total}, expected ${expectedTotal}`); failed++; }
}

check('FCFS total time', fcfs(PROCS), 10);
check('SJF total time', sjf(PROCS), 10);

console.log(`\n${passed} passed, ${failed} failed`);
if (failed > 0) process.exit(1);
