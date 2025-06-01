
import React from 'react';
import type { CellValue, CellPosition } from '../types';
import { BOX_SIZE, GRID_SIZE } from '../constants';

interface CellProps {
  value: CellValue;
  row: number;
  col: number;
  isEditable: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isError: boolean;
  isPeerSelected: boolean; 
  onClick: (pos: CellPosition) => void;
}

const Cell: React.FC<CellProps> = ({
  value,
  row,
  col,
  isEditable,
  isSelected,
  isHighlighted,
  isError,
  isPeerSelected,
  onClick,
}) => {
  const classes = [
    'sudoku-cell',
    'select-none', // Prevent text selection
    isEditable ? 'text-sky-400' : 'text-slate-100 font-semibold',
    isSelected ? 'bg-sky-700 ring-2 ring-sky-400 z-10' : '',
    isHighlighted && !isSelected ? 'bg-slate-700' : '',
    isPeerSelected && !isSelected && !isHighlighted ? 'bg-slate-800' : '',
    isError ? 'bg-red-500/50 text-white' : '',
    (col + 1) % BOX_SIZE === 0 && col < GRID_SIZE - 1 ? 'subgrid-border-right' : '',
    (row + 1) % BOX_SIZE === 0 && row < GRID_SIZE - 1 ? 'subgrid-border-bottom' : '',
  ];

  return (
    <div
      className={classes.filter(Boolean).join(' ')}
      onClick={() => onClick({ row, col })}
      role="gridcell"
      aria-selected={isSelected}
      aria-readonly={!isEditable}
      tabIndex={0} // Make it focusable for accessibility, though direct input is handled by App
    >
      {value === 0 ? '' : value}
    </div>
  );
};

export default Cell;
