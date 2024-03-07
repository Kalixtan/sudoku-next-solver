import React, { createContext, useContext, useState } from 'react';

export interface Cell {
  value: number;
  locked: boolean;
  error: boolean;
}

// Create a new context for the Sudoku state
const SudokuContext = createContext();

// Custom hook to access the Sudoku context
export const useSudoku = () => useContext(SudokuContext);

// Sudoku provider component
export const SudokuProvider = ({ children }) => {
  // Define the initial Sudoku grid state

  const getEmptyGrid = (gridHeight = 9, gridWidth = 9): Cell[][] =>
    Array(gridHeight)
      .fill(null)
      .map(() =>
        Array(gridWidth)
          .fill(null)
          .map(() => ({})),
      ); // fill grid with empty cells.

  // Define state to manage the current Sudoku grid and selected cell
  const [grid, setGrid] = useState<Cell[][]>(getEmptyGrid());
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCol, setSelectedCol] = useState(null);

  const setCell = (
    row: number,
    col: number,
    value: number,
    locked: boolean,
  ) => {
    console.log(row, col);
    const newGrid = [...grid];
    if (newGrid[row] === undefined) {
      return;
    }
    const updatedCell = {
      ...newGrid[row][col],
      value,
      locked: value !== 0 && locked,
    };
    newGrid[row] = [
      ...newGrid[row].slice(0, col),
      updatedCell,
      ...newGrid[row].slice(col + 1),
    ];
    setGrid(newGrid);
  };

  // Function to handle setting the value of a cell
  const handleSetValue = (row, col, value) => {
    const newGrid = [...grid];
    newGrid[row][col] = value;
    setGrid(newGrid);
  };

  // Function to create a new empty game grid
  const createNewGrid = () => {
    setGrid(initialGrid);
  };

  // Function to solve the Sudoku grid
  const solveSudoku = () => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        error: cell.value !== 0, // Use strict equality
      })),
    );
    setGrid(newGrid);
    console.log('Sudoku solved!');
  };

  const clearSolvedAndErrors = (): void => {
    const newGrid = grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        value: cell.locked ? cell.value : 0, // Clears solution
        error: false, // Sets the error flag for all cells to false
      })),
    );
    setGrid(newGrid);
  };

  // Expose the Sudoku state and functions through the context value
  const contextValue = {
    grid,
    setGrid,
    clearSolvedAndErrors,
    getEmptyGrid,
    selectedRow,
    selectedCol,
    handleSetValue,
    createNewGrid,
    solveSudoku,
    setCell,
    setSelected: (row: number, col: number) => {
      setSelectedRow(row);
      setSelectedCol(col);
    },
  };

  return (
    <SudokuContext.Provider value={contextValue}>
      {children}
    </SudokuContext.Provider>
  );
};
