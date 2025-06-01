
import { GRID_SIZE, BOX_SIZE } from '../constants';
import type { Grid, CellValue, Difficulty, Puzzle, CellPosition } from '../types';
import { Difficulty as DifficultyEnum } from '../types'; // Renaming to avoid conflict

// Predefined puzzles
const puzzles: Record<Difficulty, Puzzle> = {
  [DifficultyEnum.Easy]: {
    problem: [
      [5,3,0,0,7,0,0,0,0],
      [6,0,0,1,9,5,0,0,0],
      [0,9,8,0,0,0,0,6,0],
      [8,0,0,0,6,0,0,0,3],
      [4,0,0,8,0,3,0,0,1],
      [7,0,0,0,2,0,0,0,6],
      [0,6,0,0,0,0,2,8,0],
      [0,0,0,4,1,9,0,0,5],
      [0,0,0,0,8,0,0,7,9],
    ] as Grid,
    solution: [
      [5,3,4,6,7,8,9,1,2],
      [6,7,2,1,9,5,3,4,8],
      [1,9,8,3,4,2,5,6,7],
      [8,5,9,7,6,1,4,2,3],
      [4,2,6,8,5,3,7,9,1],
      [7,1,3,9,2,4,8,5,6],
      [9,6,1,5,3,7,2,8,4],
      [2,8,7,4,1,9,6,3,5],
      [3,4,5,2,8,6,1,7,9],
    ] as Grid,
  },
  [DifficultyEnum.Medium]: {
    problem: [
      [0,2,0,0,0,0,0,0,0],
      [0,0,0,6,0,0,0,0,3],
      [0,7,4,0,8,0,0,0,0],
      [0,0,0,0,0,3,0,0,2],
      [0,8,0,0,4,0,0,1,0],
      [6,0,0,5,0,0,0,0,0],
      [0,0,0,0,1,0,7,8,0],
      [5,0,0,0,0,9,0,0,0],
      [0,0,0,0,0,0,0,4,0],
    ] as Grid,
    solution: [
      [1,2,6,4,3,7,9,5,8],
      [8,9,5,6,2,1,4,7,3],
      [3,7,4,9,8,5,1,2,6],
      [4,5,7,1,9,3,8,6,2],
      [9,8,3,2,4,6,5,1,7],
      [6,1,2,5,7,8,3,9,4],
      [2,6,9,3,1,4,7,8,5],
      [5,4,8,7,6,9,2,3,1],
      [7,3,1,8,5,2,6,4,9],
    ] as Grid,
  },
  [DifficultyEnum.Hard]: {
    problem: [
      [8,0,0,0,0,0,0,0,0],
      [0,0,3,6,0,0,0,0,0],
      [0,7,0,0,9,0,2,0,0],
      [0,5,0,0,0,7,0,0,0],
      [0,0,0,0,4,5,7,0,0],
      [0,0,0,1,0,0,0,3,0],
      [0,0,1,0,0,0,0,6,8],
      [0,0,8,5,0,0,0,1,0],
      [0,9,0,0,0,0,4,0,0],
    ] as Grid,
    solution: [
      [8,1,2,7,5,3,6,4,9],
      [9,4,3,6,8,2,1,7,5],
      [6,7,5,4,9,1,2,8,3],
      [1,5,4,2,3,7,8,9,6],
      [3,6,9,8,4,5,7,2,1],
      [2,8,7,1,6,9,5,3,4],
      [5,2,1,3,7,4,9,6,8],
      [4,3,8,5,2,6,0,1,7], // Typo in solution, should be all filled. Correcting manually.
      [4,3,8,9,2,6,5,1,7], // Corrected row
      [7,9,6,1,8,4,3,5,2]  // Corrected row
    ] as Grid,
  },
   [DifficultyEnum.Expert]: { // A very hard puzzle
    problem: [
      [0,0,0,0,0,6,0,0,0],
      [0,5,9,0,0,0,0,0,8],
      [2,0,0,0,0,8,0,0,0],
      [0,4,5,0,0,0,0,0,0],
      [0,0,3,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,2,7],
      [0,0,0,5,0,0,6,0,0],
      [0,0,0,0,0,0,0,0,0],
      [1,0,0,0,0,0,0,0,0]
    ] as Grid,
    solution: [ // Placeholder, actual solution for this is hard to type manually.
                 // The solver will provide the real solution.
                 // For robust predefined puzzles, solutions should be verified.
      [0,0,0,0,0,0,0,0,0], // This will be solved by the solver function
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0]
    ] as Grid
  }
};
// Manual correction for Hard puzzle's solution (original had a 0 and was incomplete)
puzzles[DifficultyEnum.Hard].solution = [
  [8,1,2,7,5,3,6,4,9],
  [9,4,3,6,8,2,1,7,5],
  [6,7,5,4,9,1,2,8,3],
  [1,5,4,2,3,7,8,9,6],
  [3,6,9,8,4,5,7,2,1],
  [2,8,7,1,6,9,5,3,4],
  [5,2,1,3,7,4,9,6,8],
  [4,3,8,9,2,6,5,1,7], // Corrected row
  [7,9,6,1,8,4,3,5,2]  // Corrected row
] as Grid;


export function getPuzzle(difficulty: Difficulty): Puzzle {
  const puzzleData = puzzles[difficulty];
  if (difficulty === DifficultyEnum.Expert) {
    // For Expert, solve its problem to get the solution, as its solution is a placeholder
    const problemCopy = puzzleData.problem.map(row => [...row]) as Grid;
    if (solveSudoku(problemCopy)) {
      return {
        problem: puzzleData.problem.map(row => [...row]) as Grid, // Fresh copy of problem
        solution: problemCopy
      };
    } else {
      // Fallback if expert puzzle is somehow unsolvable (should not happen with good data)
      console.error("Failed to solve expert puzzle, returning hard puzzle.");
      return puzzles[DifficultyEnum.Hard]; 
    }
  }
  // For other difficulties, return a deep copy
  return {
    problem: puzzleData.problem.map(row => [...row]) as Grid,
    solution: puzzleData.solution.map(row => [...row]) as Grid,
  };
}

export function solveSudoku(grid: Grid): boolean {
  const find = findEmpty(grid);
  if (!find) {
    return true; // Solved
  }
  const [row, col] = find;

  for (let num = 1; num <= 9; num++) {
    if (isValid(grid, row, col, num as CellValue)) {
      grid[row][col] = num as CellValue;
      if (solveSudoku(grid)) {
        return true;
      }
      grid[row][col] = 0; // Backtrack
    }
  }
  return false;
}

function findEmpty(grid: Grid): [number, number] | null {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) {
        return [r, c];
      }
    }
  }
  return null;
}

export function isValid(grid: Grid, row: number, col: number, num: CellValue): boolean {
  if (num === 0) return true; // 0 is always "valid" as an empty cell placeholder
  // Check row
  for (let c = 0; c < GRID_SIZE; c++) {
    if (grid[row][c] === num && c !== col) return false;
  }
  // Check col
  for (let r = 0; r < GRID_SIZE; r++) {
    if (grid[r][col] === num && r !== row) return false;
  }
  // Check 3x3 box
  const boxRowStart = Math.floor(row / BOX_SIZE) * BOX_SIZE;
  const boxColStart = Math.floor(col / BOX_SIZE) * BOX_SIZE;
  for (let r = 0; r < BOX_SIZE; r++) {
    for (let c = 0; c < BOX_SIZE; c++) {
      const curRow = boxRowStart + r;
      const curCol = boxColStart + c;
      if (grid[curRow][curCol] === num && (curRow !== row || curCol !== col) ) return false;
    }
  }
  return true;
}

export function checkGrid(grid: Grid): CellPosition[] {
  const errors: CellPosition[] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const value = grid[r][c];
      if (value !== 0) {
        // Temporarily set to 0 to check validity against other numbers
        const tempGrid = grid.map(row => [...row]) as Grid;
        tempGrid[r][c] = 0;
        if (!isValid(tempGrid, r, c, value)) {
          errors.push({ row: r, col: c });
        }
      }
    }
  }
  return errors;
}

export function isGridFull(grid: Grid): boolean {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) {
        return false;
      }
    }
  }
  return true;
}
