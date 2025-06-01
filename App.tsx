
import React, { useState, useEffect, useCallback } from 'react';
import type { Grid, CellValue, CellPosition, Puzzle } from './types';
import { Difficulty } from './types';
import SudokuGrid from './components/SudokuGrid';
import NumberPad from './components/NumberPad';
import DifficultySelector from './components/DifficultySelector';
import { getPuzzle, solveSudoku, checkGrid, isGridFull, isValid } from './services/sudokuService';
import { GRID_SIZE, BOX_SIZE } from './constants';

const App: React.FC = () => {
  const [difficulty, setDifficulty] = useState<Difficulty>(Difficulty.Easy);
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [currentGrid, setCurrentGrid] = useState<Grid | null>(null);
  const [selectedCell, setSelectedCell] = useState<CellPosition | null>(null);
  const [errorCells, setErrorCells] = useState<CellPosition[]>([]);
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [highlightedPeers, setHighlightedPeers] = useState<CellPosition[]>([]);

  const initializeNewGame = useCallback((selectedDifficulty: Difficulty) => {
    const newPuzzle = getPuzzle(selectedDifficulty);
    setPuzzle(newPuzzle);
    setCurrentGrid(newPuzzle.problem.map(row => [...row]) as Grid); // Deep copy
    setSelectedCell(null);
    setErrorCells([]);
    setIsSolved(false);
    setMessage(`New ${selectedDifficulty} game started!`);
    setHighlightedPeers([]);
  }, []);

  useEffect(() => {
    initializeNewGame(difficulty);
  }, [difficulty, initializeNewGame]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!selectedCell || !currentGrid || !puzzle) return;
      if (puzzle.problem[selectedCell.row][selectedCell.col] !== 0) return; // Cell is not editable

      let num: CellValue | null = null;
      if (event.key >= '1' && event.key <= '9') {
        num = parseInt(event.key, 10) as CellValue;
      } else if (event.key === 'Backspace' || event.key === 'Delete') {
        num = 0;
      }

      if (num !== null) {
        handleNumberInput(num);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedCell, currentGrid, puzzle]); // eslint-disable-line react-hooks/exhaustive-deps 
  // Added currentGrid and puzzle to deps, as handleNumberInput uses them.

  const handleCellClick = (pos: CellPosition) => {
    setSelectedCell(pos);
    updateHighlightedPeers(pos, currentGrid);
    setMessage(''); // Clear message on cell selection
  };
  
  const updateHighlightedPeers = (pos: CellPosition | null, grid: Grid | null) => {
    if (!pos || !grid) {
        setHighlightedPeers([]);
        return;
    }
    const peers: CellPosition[] = [];
    const selectedValue = grid[pos.row][pos.col];
    if (selectedValue !== 0) {
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (grid[r][c] === selectedValue) {
                    peers.push({row: r, col: c});
                }
            }
        }
    }
    setHighlightedPeers(peers);
  };


  const handleNumberInput = (num: CellValue) => {
    if (!selectedCell || !currentGrid || !puzzle) return;
    if (puzzle.problem[selectedCell.row][selectedCell.col] !== 0) { // Original puzzle cell, not editable
        setMessage("This cell is part of the puzzle and cannot be changed.");
        return;
    }

    const newGrid = currentGrid.map(row => [...row]) as Grid;
    newGrid[selectedCell.row][selectedCell.col] = num;
    setCurrentGrid(newGrid);

    // Live validation (optional, can be performance intensive for some)
    // const currentErrors = checkGrid(newGrid);
    // setErrorCells(currentErrors);
    updateHighlightedPeers(selectedCell, newGrid); // Update highlights based on new number

    if (num !== 0 && !isValid(newGrid, selectedCell.row, selectedCell.col, num)) {
        setErrorCells([{row: selectedCell.row, col: selectedCell.col}]);
        setMessage("This number creates a conflict!");
    } else {
        setErrorCells(errorCells.filter(err => !(err.row === selectedCell.row && err.col === selectedCell.col)));
        setMessage(''); // Clear conflict message if fixed
    }


    // Check for solved state after input
    if (isGridFull(newGrid)) {
      const finalErrors = checkGrid(newGrid);
      if (finalErrors.length === 0) {
        setIsSolved(true);
        setMessage('Congratulations! Puzzle Solved!');
        setSelectedCell(null); // Deselect cell on solve
        setHighlightedPeers([]);
      } else {
         setErrorCells(finalErrors);
         setMessage('Puzzle is full, but contains errors. Keep trying!');
      }
    } else {
      setIsSolved(false); // Not full yet
    }
  };

  const handleSolve = () => {
    if (!puzzle) return;
    const solutionGrid = puzzle.solution.map(r => [...r]) as Grid; // Use pre-calculated solution
    setCurrentGrid(solutionGrid);
    setIsSolved(true);
    setErrorCells([]);
    setMessage('Puzzle Solved with help!');
    setSelectedCell(null);
    setHighlightedPeers([]);
  };

  const handleCheck = () => {
    if (!currentGrid) return;
    const errors = checkGrid(currentGrid);
    setErrorCells(errors);
    if (errors.length > 0) {
      setMessage(`Found ${errors.length} error(s). Keep trying!`);
    } else {
      if (isGridFull(currentGrid)) {
        setIsSolved(true);
        setMessage('Congratulations! Puzzle Solved!');
        setSelectedCell(null);
        setHighlightedPeers([]);
      } else {
        setMessage('No errors found so far. Keep going!');
      }
    }
  };
  
  const handleDifficultyChange = (newDifficulty: Difficulty) => {
    setDifficulty(newDifficulty);
    // initializeNewGame will be called by useEffect due to difficulty change
  };

  if (!currentGrid || !puzzle) {
    return <div className="text-center text-2xl p-10">Loading Sudoku...</div>;
  }

  return (
    <div className="flex flex-col items-center p-2 sm:p-4 min-h-screen w-full max-w-4xl mx-auto">
      <header className="my-6 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-sky-400">Sudoku Master</h1>
        <p className="text-slate-400 mt-1">Challenge your mind!</p>
      </header>

      <DifficultySelector selectedDifficulty={difficulty} onSelectDifficulty={handleDifficultyChange} />
      
      <div className="flex flex-col sm:flex-row items-start justify-center w-full">
        <SudokuGrid
          puzzleGrid={puzzle.problem}
          currentGrid={currentGrid}
          selectedCell={selectedCell}
          errorCells={errorCells}
          onCellClick={handleCellClick}
          highlightedPeers={highlightedPeers}
        />
        <div className="mt-4 sm:mt-0 sm:ml-6 flex flex-col items-center">
          <NumberPad 
            onNumberClick={handleNumberInput} 
            onEraseClick={() => handleNumberInput(0)}
            disabled={!selectedCell || (selectedCell && puzzle.problem[selectedCell.row][selectedCell.col] !== 0) || isSolved}
          />
          <div className="mt-4 space-y-2 w-full max-w-xs">
            <button 
              onClick={handleCheck} 
              disabled={isSolved}
              className="w-full bg-yellow-500 hover:bg-yellow-400 text-slate-900 font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              Check Progress
            </button>
            <button 
              onClick={handleSolve} 
              disabled={isSolved}
              className="w-full bg-green-500 hover:bg-green-400 text-slate-900 font-semibold py-2 px-4 rounded-md transition-colors disabled:opacity-50"
            >
              Solve Puzzle
            </button>
            <button 
              onClick={() => initializeNewGame(difficulty)}
              className="w-full bg-sky-500 hover:bg-sky-400 text-slate-900 font-semibold py-2 px-4 rounded-md transition-colors"
            >
              New Game ({difficulty})
            </button>
          </div>
        </div>
      </div>

      {message && (
        <div className={`mt-6 p-3 rounded-md text-center font-medium
          ${isSolved && errorCells.length === 0 ? 'bg-green-600 text-white' : 
            errorCells.length > 0 ? 'bg-red-600 text-white' : 
            'bg-slate-700 text-slate-100'}`}>
          {message}
        </div>
      )}
       <footer className="mt-8 text-center text-slate-500 text-sm">
        <p>Select a cell, then use your keyboard or the number pad to enter values.</p>
        <p>&copy; {new Date().getFullYear()} Sudoku Master. Built for fun.</p>
      </footer>
    </div>
  );
};

export default App;
