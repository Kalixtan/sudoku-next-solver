'use client';

import React, { useState } from 'react';
import { SudokuProvider } from '@/components/SudokuProvider';
import SudokuGrid from '@/components/SudokuGrid';
import SidePanel from '@/components/SidePanel';
import styles from './Sudoku.module.scss';

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
