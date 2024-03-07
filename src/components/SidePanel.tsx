import React from 'react';
import { setGridCell } from './Sudoku';
import styles from './SidePanel.module.scss';
import EraserIcon from './icons/eraser.svg';
import SolveIcon from './icons/solve.svg';
import { useSudoku } from './SudokuProvider';

const SidePanel: React.FC = (): void => {
  const {
    grid,
    clearSolvedAndErrors,
    setCell,
    setSelected,
    solveSudoku,
    selectedRow,
    selectedCol,
  } = useSudoku();
  const numberButtons: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return (
    <div className={styles.sidePanel}>
      {numberButtons.map(
        (number, index) =>
          // Render three buttons per row
          index % 3 === 0 && (
            <div className={styles.row} key={`row-${Math.floor(index / 3)}`}>
              {numberButtons.slice(index, index + 3).map((value) => (
                <button
                  key={value}
                  className={`${styles.panelButton} ${styles.squareButton}`}
                  onClick={() => {
                    setCell(selectedRow, selectedCol, value, true);
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
          ),
      )}
      <div className={styles.row}>
        <button
          className={`${styles.panelButton} ${styles.eraseButton}`}
          onClick={() => {
            setCell(selectedRow, selectedCol, 0, false);
          }}
        >
          <EraserIcon />
          Erase
        </button>
      </div>
      <div className={styles.row}>
        <button
          className={`${styles.panelButton} ${styles.eraseButton}`}
          onClick={() => {
            solveSudoku();
          }}
        >
          <SolveIcon />
          Solve
        </button>
      </div>
    </div>
  );
};

export default SidePanel;
