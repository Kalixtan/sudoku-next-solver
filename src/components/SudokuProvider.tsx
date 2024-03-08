import React, { createContext, useContext, useState } from 'react';

export interface Cell {
  value: number;
  locked: boolean;
  error: boolean;
}

export interface ISudokuContext {
  grid: Cell[][];
  clearSolvedAndErrors: () => void;
  setCell: (row: number, col: number, value: number, locked: boolean) => void;
  setSelected: (row: number, col: number) => void;
  solveSudoku: () => void;
  selectedRow: number | null;
  selectedCol: number | null;
}

// Ensure your SudokuContext uses this interface for its type
const SudokuContext = createContext<ISudokuContext | null>(null);
export const useSudoku = (): ISudokuContext => {
  const context = useContext(SudokuContext);
  if (!context) {
    throw new Error('useSudoku must be used within a SudokuProvider');
  }
  return context;
};

// Sudoku provider component
export const SudokuProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const getEmptyGrid = (gridHeight = 9, gridWidth = 9): Cell[][] =>
    Array(gridHeight)
      .fill(null)
      .map(() =>
        Array(gridWidth)
          .fill(null)
          .map(() => ({
            value: 0, // Default value for an empty cell
            locked: false, // Newly created cells are not locked
            error: false, // Newly created cells do not have errors
          })),
      );
  // fill grid with empty cells.
  const initialGrid = getEmptyGrid;

  // Define state to manage the current Sudoku grid and selected cell
  const [grid, setGrid] = useState<Cell[][]>(getEmptyGrid());
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const [selectedCol, setSelectedCol] = useState<number | null>(null);

  const setCell = (
    row: number,
    col: number,
    value: number,
    locked: boolean,
  ) => {
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

  // Function to create a new empty game grid
  const createNewGrid = () => {
    setGrid(initialGrid());
  };

  // Function to check if cell is valid in sudoku
  const checkValidCell = (
    tempGrid: Cell[][],
    row: number,
    col: number,
    value: number,
  ): boolean => {
    if (value === 0) return true;

    // Check all columns in the given row except for the column of the current cell.
    for (let i = 0; i < tempGrid.length; i++) {
      if (tempGrid[row][i].value === value && i !== col) return false;
    }

    // Check all rows in the given row except for the row of the current cell.
    for (let i = 0; i < tempGrid[0].length; i++) {
      if (tempGrid[i][col].value === value && i !== row) return false;
    }

    // Check the current 3x3 sub-grid except for the current cell.
    var startCol = Math.floor(col / 3) * 3;
    var startRow = Math.floor(row / 3) * 3;
    for (let x = 0; x < 3; x++) {
      for (let y = 0; y < 3; y++) {
        var c = startCol + x;
        var r = startRow + y;

        if (c != col && r != row && tempGrid[r][c].value == value) {
          return false;
        }
      }
    }

    return true;
  };

  // Function to check the game grid
  const checkValidGrid = (tempGrid: Cell[][]): boolean => {
    let isValid = true;

    const newGrid = tempGrid.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const isCellValid = checkValidCell(
          tempGrid,
          rowIndex,
          colIndex,
          cell.value,
        );
        if (!isCellValid) isValid = false; // Update isValid if any cell is not valid

        return { ...cell, error: !isCellValid };
      }),
    );

    setGrid(newGrid);
    return isValid; // Return the overall validity of the grid
  };

  // Function to solve the Sudoku grid step by step
  // Adapted solveStep function for React
  const solveStep = (tempGrid: Cell[][], row = 0, col = 0): boolean => {
    if (row === 8 && col === 9) {
      setGrid(tempGrid); // Update the main grid once the solution is found
      return true;
    }

    if (col === 9) {
      row++;
      col = 0;
    }

    if (tempGrid[row][col].value > 0) {
      return solveStep(tempGrid, row, col + 1);
    }

    for (let num = 1; num <= 9; num++) {
      if (checkValidCell(tempGrid, row, col, num)) {
        // Create a deep copy of the grid to manipulate
        const newGrid = tempGrid.map((row) => row.map((cell) => ({ ...cell })));
        newGrid[row][col].value = num; // Try this number for the current cell

        if (solveStep(newGrid, row, col + 1)) {
          return true;
        }

        // If not valid, reset the cell and continue trying
        newGrid[row][col].value = 0;
      }
    }

    return false; // Trigger backtracking
  };

  // Modify solveSudoku to use solveStep properly
  const solveSudoku = () => {
    const tempGrid = grid.map((row) => row.map((cell) => ({ ...cell }))); // Deep copy of the grid

    if (!checkValidGrid(tempGrid)) {
      console.log('Invalid grid configuration.');
      return;
    }

    if (solveStep(tempGrid)) {
      console.log('Sudoku solved!');
    } else {
      console.log('Solution not found.');
    }
  };

  // Cleans up error tiles as well as past solusions
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
