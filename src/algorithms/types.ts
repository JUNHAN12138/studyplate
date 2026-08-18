export interface Step<S> {
  state: S;
  desc: string;
  lines?: number[];
}

export interface SortState {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  pivot?: number;
  i?: number;
  j?: number;
}
