
export type CellValue = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type Grid = CellValue[][];

export interface CellPosition {
  row: number;
  col: number;
}

export enum Difficulty {
  Easy = "Easy",
  Medium = "Medium",
  Hard = "Hard",
  Expert = "Expert",
}

export interface Puzzle {
  problem: Grid;
  solution: Grid;
}
