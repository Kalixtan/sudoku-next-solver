import React from 'react';
import Sudoku from '@/components/Sudoku';
import styles from './page.module.css';

const MainLayout: React.FC = () => {
  return (
    <main className={styles.main}>
      <Sudoku />
    </main>
  );
};

export default MainLayout;
