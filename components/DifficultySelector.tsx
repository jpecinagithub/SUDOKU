
import React from 'react';
import { Difficulty } from '../types';

interface DifficultySelectorProps {
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
}

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ selectedDifficulty, onSelectDifficulty }) => {
  const difficulties = Object.values(Difficulty);

  return (
    <div className="flex flex-wrap justify-center gap-2 my-4">
      {difficulties.map((level) => (
        <button
          key={level}
          onClick={() => onSelectDifficulty(level)}
          className={`px-4 py-2 rounded-md font-semibold transition-all
            ${selectedDifficulty === level 
              ? 'bg-sky-600 text-white shadow-lg ring-2 ring-sky-400' 
              : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
        >
          {level}
        </button>
      ))}
    </div>
  );
};

export default DifficultySelector;
