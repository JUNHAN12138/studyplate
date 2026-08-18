import type { Step } from '../types';

export interface Process {
  id: string;
  arrival: number;
  burst: number;
}

export interface ScheduleState {
  time: number;
  running?: string;
  readyQueue: string[];
  completed: { id: string; start: number; end: number }[];
  gantt: { id: string; start: number; end: number }[];
}

export function fcfs(processes: Process[]): Step<ScheduleState>[] {
  const steps: Step<ScheduleState>[] = [];
  const sorted = [...processes].sort((a, b) => a.arrival - b.arrival);
  const gantt: ScheduleState['gantt'] = [];
  const completed: ScheduleState['completed'] = [];
  let time = 0;

  steps.push({
    state: { time: 0, readyQueue: sorted.map(p => p.id), completed: [], gantt: [] },
    desc: 'FCFS：按到达时间排队',
    lines: [1],
  });

  for (const p of sorted) {
    if (time < p.arrival) time = p.arrival;
    const start = time;
    const end = time + p.burst;
    gantt.push({ id: p.id, start, end });
    completed.push({ id: p.id, start, end });
    time = end;

    steps.push({
      state: { time, running: p.id, readyQueue: sorted.filter(x => !completed.find(c => c.id === x.id)).map(x => x.id), completed: [...completed], gantt: [...gantt] },
      desc: `运行 ${p.id}: 时间 ${start}→${end}`,
      lines: [2, 3],
    });
  }

  steps.push({
    state: { time, readyQueue: [], completed: [...completed], gantt: [...gantt] },
    desc: `FCFS 完成，总时间 ${time}`,
    lines: [4],
  });
  return steps;
}

export function sjf(processes: Process[]): Step<ScheduleState>[] {
  const steps: Step<ScheduleState>[] = [];
  const remaining = [...processes].sort((a, b) => a.arrival - b.arrival);
  const gantt: ScheduleState['gantt'] = [];
  const completed: ScheduleState['completed'] = [];
  let time = 0;

  steps.push({
    state: { time: 0, readyQueue: remaining.map(p => p.id), completed: [], gantt: [] },
    desc: 'SJF（非抢占）：最短作业优先',
    lines: [1],
  });

  while (remaining.length > 0) {
    const ready = remaining.filter(p => p.arrival <= time);
    if (ready.length === 0) { time = remaining[0].arrival; continue; }
    ready.sort((a, b) => a.burst - b.burst);
    const p = ready[0];
    const idx = remaining.indexOf(p);
    remaining.splice(idx, 1);

    const start = time;
    const end = time + p.burst;
    gantt.push({ id: p.id, start, end });
    completed.push({ id: p.id, start, end });
    time = end;

    steps.push({
      state: { time, running: p.id, readyQueue: remaining.map(x => x.id), completed: [...completed], gantt: [...gantt] },
      desc: `选择最短作业 ${p.id}(burst=${p.burst}): 时间 ${start}→${end}`,
      lines: [2, 3],
    });
  }

  steps.push({
    state: { time, readyQueue: [], completed: [...completed], gantt: [...gantt] },
    desc: `SJF 完成，总时间 ${time}`,
    lines: [4],
  });
  return steps;
}

export function roundRobin(processes: Process[], quantum: number): Step<ScheduleState>[] {
  const steps: Step<ScheduleState>[] = [];
  const remaining = processes.map(p => ({ ...p, remaining: p.burst }));
  const gantt: ScheduleState['gantt'] = [];
  const completed: ScheduleState['completed'] = [];
  let time = 0;
  const queue: typeof remaining = [];
  let ptr = 0;

  remaining.sort((a, b) => a.arrival - b.arrival);

  steps.push({
    state: { time: 0, readyQueue: remaining.map(p => p.id), completed: [], gantt: [] },
    desc: `RR (时间片=${quantum})：轮转调度`,
    lines: [1],
  });

  // Add initially arrived
  while (ptr < remaining.length && remaining[ptr].arrival <= time) {
    queue.push(remaining[ptr++]);
  }

  while (queue.length > 0) {
    const p = queue.shift()!;
    const run = Math.min(quantum, p.remaining);
    const start = time;
    time += run;
    p.remaining -= run;
    gantt.push({ id: p.id, start, end: time });

    // Add newly arrived
    while (ptr < remaining.length && remaining[ptr].arrival <= time) {
      queue.push(remaining[ptr++]);
    }

    if (p.remaining > 0) {
      queue.push(p);
      steps.push({
        state: { time, running: p.id, readyQueue: queue.map(x => x.id), completed: [...completed], gantt: [...gantt] },
        desc: `${p.id} 运行 ${run}，剩余 ${p.remaining}，重新入队`,
        lines: [2, 3],
      });
    } else {
      completed.push({ id: p.id, start: 0, end: time });
      steps.push({
        state: { time, running: p.id, readyQueue: queue.map(x => x.id), completed: [...completed], gantt: [...gantt] },
        desc: `${p.id} 运行完成，时间 ${time}`,
        lines: [3, 4],
      });
    }
  }

  steps.push({
    state: { time, readyQueue: [], completed: [...completed], gantt: [...gantt] },
    desc: `RR 完成，总时间 ${time}`,
    lines: [5],
  });
  return steps;
}

export const scheduleCode = `function schedule(processes, algo) {
  sortByArrival(processes);            // 1
  while (readyQueue.length > 0) {      // 2
    pick = selectNext(algo);           // 3
    run(pick, quantum);                // 4
  }                                    // 5
}`;
