'use client';
import React, { useEffect } from 'react';
import { setGridCell, solveGrid } from './Sudoku';
import { useSudoku } from './SudokuProvider';
import styles from './SudokuGrid.module.scss';

interface SudokuCellProps {
  row: number;
  col: number;
  cell: Cell;
  onCellClick: (row: number, col: number) => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  row,
  col,
  cell,
  onCellClick,
}) => {
  const { selectedRow, selectedCol } = useSudoku();

  const classes = [styles.cell];

  const isSelected = selectedCol === col && selectedRow === row;
  const isSelectionAligned =
    selectedRow === row ||
    selectedCol === col ||
    (Math.floor(selectedCol / 3) === Math.floor(col / 3) &&
      Math.floor(selectedRow / 3) === Math.floor(row / 3));
  const isLineHor = col % 3 === 2 && col !== 8;
  const isLineVer = row % 3 === 2 && row !== 8;

  if (cell.value !== 0) classes.push(styles.value);
  if (cell.locked) classes.push(styles.locked);
  if (isSelected) classes.push(styles.selected);
  if (isSelectionAligned) classes.push(styles.aligned);
  if (isLineHor) classes.push(styles.lineHor);
  if (isLineVer) classes.push(styles.lineVer);
  if (cell.error) classes.push(styles.error);

  return (
    <button
      className={classes.join(' ')}
      onClick={() => {
        onCellClick(row, col);
      }}
    >
      {cell.value ?? ''}
    </button>
  );
};

const SudokuGrid: React.FC = () => {
  const {
    grid,
    clearSolvedAndErrors,
    setCell,
    setSelected,
    solveSudoku,
    selectedRow,
    selectedCol,
  } = useSudoku();

  const handleCellClick = (row: number, col: number): void => {
    clearSolvedAndErrors();
    setSelected(row, col);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (selectedRow !== null && selectedCol !== null) {
        // Prevent default behavior for certain keys
        if ([' ', 'Tab', 'Enter'].includes(event.key)) {
          event.preventDefault();
        }

        switch (event.key) {
          case 'ArrowUp':
            setSelected(Math.max(0, selectedRow - 1), selectedCol);
            break;
          case 'ArrowDown':
            setSelected(
              Math.min(grid.length - 1, selectedRow + 1),
              selectedCol,
            );
            break;
          case 'ArrowLeft':
            setSelected(selectedRow, Math.max(0, selectedCol - 1));
            break;
          case 'ArrowRight':
            setSelected(
              selectedRow,
              Math.min(grid[0].length - 1, selectedCol + 1),
            );
            break;
          case 'Backspace':
          case 'Delete':
          case ' ':
            setCell(selectedRow, selectedCol, 0, false);
            break;
          case 'Enter':
            solveSudoku();
            break;
          default:
            if (event.key >= '1' && event.key <= '9') {
              setCell(selectedRow, selectedCol, parseInt(event.key), true);
            }
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [grid, selectedCol, selectedRow]);

  return (
    <div className={styles.grid} tabIndex={0}>
      {grid.map((rowCells, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {rowCells.map((cell, colIndex) => (
            <SudokuCell
              key={colIndex}
              row={rowIndex}
              col={colIndex}
              cell={cell}
              onCellClick={handleCellClick}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default SudokuGrid;
