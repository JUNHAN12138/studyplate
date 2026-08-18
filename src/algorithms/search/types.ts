export interface SearchState {
  array: number[];
  current: number;
  found: boolean;
  target: number;
  low?: number;
  high?: number;
  mid?: number;
  visited: number[];
}
