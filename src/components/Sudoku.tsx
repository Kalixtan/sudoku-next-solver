'use client';

// Removed 'useEffect' from the import since it's not used.
import React, { useState } from 'react';
import SudokuGrid from '@/components/SudokuGrid'; // Assuming this is your main Sudoku grid component
import SidePanel from '@/components/SidePanel';
import { SudokuProvider } from '@/components/SudokuProvider';
import styles from './Sudoku.module.scss';

// The component itself is fine, just fixed the imports and related functions.
const Sudoku: React.FC = () => {
  return (
    <div className={styles.mainLayout}>
      <SudokuProvider>
        <SudokuGrid />
        <SidePanel />
      </SudokuProvider>
    </div>
  );
};

export default Sudoku;
