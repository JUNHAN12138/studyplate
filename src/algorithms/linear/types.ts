export interface StackState {
  stack: number[];
  top: number;
  action: string;
  value?: number;
}

export interface QueueState {
  queue: number[];
  front: number;
  rear: number;
  action: string;
  value?: number;
}

export interface CircularQueueState {
  buffer: (number | null)[];
  front: number;
  rear: number;
  size: number;
  capacity: number;
  action: string;
  value?: number;
}
