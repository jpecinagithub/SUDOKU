
import React from 'react';
import type { CellValue } from '../types';

interface NumberPadProps {
  onNumberClick: (num: CellValue) => void;
  onEraseClick: () => void;
  disabled?: boolean;
}

const NumberButton: React.FC<{ number: CellValue; onClick: (num: CellValue) => void, disabled?: boolean }> = ({ number, onClick, disabled }) => (
  <button
    onClick={() => onClick(number)}
    disabled={disabled}
    className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-700 hover:bg-slate-600 text-slate-100 font-bold text-xl rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {number === 0 ? 'X' : number}
  </button>
);

const NumberPad: React.FC<NumberPadProps> = ({ onNumberClick, onEraseClick, disabled }) => {
  const numbers: CellValue[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className="grid grid-cols-5 gap-2 p-2 bg-slate-800 rounded-lg shadow-md mt-4 sm:mt-0 sm:ml-4">
      {numbers.map((num) => (
        <NumberButton key={num} number={num} onClick={onNumberClick} disabled={disabled} />
      ))}
      <button
        onClick={onEraseClick}
        disabled={disabled}
        className="w-12 h-12 sm:w-14 sm:h-14 bg-red-600 hover:bg-red-500 text-white font-bold text-xl rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 disabled:opacity-50 disabled:cursor-not-allowed col-span-2" // Erase button spans 2 columns
      >
        Erase
      </button>
    </div>
  );
};

export default NumberPad;
