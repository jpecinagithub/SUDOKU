
import React from 'react';
import type { Grid, CellPosition }
from '../types';
import { GRID_SIZE, BOX_SIZE } from '../constants';
import Cell from './Cell';

interface SudokuGridProps {
  puzzleGrid: Grid; // The initial puzzle, shows original numbers
  currentGrid: Grid; // The user's current working grid
  selectedCell: CellPosition | null;
  errorCells: CellPosition[];
  onCellClick: (pos: CellPosition) => void;
  highlightedPeers: CellPosition[];
}

const SudokuGrid: React.FC<SudokuGridProps> = ({
  puzzleGrid,
  currentGrid,
  selectedCell,
  errorCells,
  onCellClick,
  highlightedPeers,
}) => {
  return (
    <div className="sudoku-grid shadow-2xl rounded-md overflow-hidden">
      {currentGrid.map((rowValues, rowIndex) =>
        rowValues.map((cellValue, colIndex) => {
          const pos = { row: rowIndex, col: colIndex };
          const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
          const isEditable = puzzleGrid[rowIndex][colIndex] === 0;
          const isError = errorCells.some(errPos => errPos.row === rowIndex && errPos.col === colIndex);
          
          let isHighlighted = false;
          let isPeerSelected = false;

          if (selectedCell) {
            const isInSameRow = selectedCell.row === rowIndex;
            const isInSameCol = selectedCell.col === colIndex;
            const isInSameBox = 
              Math.floor(selectedCell.row / BOX_SIZE) === Math.floor(rowIndex / BOX_SIZE) &&
              Math.floor(selectedCell.col / BOX_SIZE) === Math.floor(colIndex / BOX_SIZE);
            
            if (isInSameRow || isInSameCol || isInSameBox) {
              isHighlighted = true;
            }

            if(highlightedPeers.some(p => p.row === rowIndex && p.col === colIndex)) {
                isPeerSelected = true;
            }
          }
          
          return (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              value={cellValue}
              row={rowIndex}
              col={colIndex}
              isEditable={isEditable}
              isSelected={isSelected}
              isHighlighted={isHighlighted}
              isError={isError}
              isPeerSelected={isPeerSelected}
              onClick={onCellClick}
            />
          );
        })
      )}
    </div>
  );
};

export default SudokuGrid;
