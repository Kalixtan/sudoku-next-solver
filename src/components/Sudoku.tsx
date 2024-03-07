'use client'

// Removed 'useEffect' from the import since it's not used.
import React, { useState } from 'react'
import SudokuGrid from '@/components/SudokuGrid' // Assuming this is your main Sudoku grid component
import SidePanel from '@/components/SidePanel'
import styles from './Sudoku.module.scss'

// This function does not need changes since it's a pure function outside component scope.
const getEmptyGrid = (gridHeight = 9, gridWidth = 9): Cell[][] =>
  Array(gridHeight)
    .fill(null)
    .map(() => Array(gridWidth).fill(null).map(() => ({}))) // fill grid with empty cells.

// Interface used, don't remove.
interface GameState {
  grid: Cell[][]
  selectedRow: number | null // Changed from 'number' as your initial state uses null.
  selectedColumn: number | null // Same as above.
}

// Ensure all your exported functions have a return type, in this case, it is Cell[][].
export const setGridCell = (
  grid: Cell[][],
  row: number,
  col: number,
  value: number,
  locked: boolean
): Cell[][] => {
  const newGrid = [...grid]
  if (newGrid[row] !== undefined) {
    const updatedCell = {
      ...newGrid[row][col],
      value,
      locked: value !== 0 && locked
    }
    newGrid[row] = [
      ...newGrid[row].slice(0, col),
      updatedCell,
      ...newGrid[row].slice(col + 1)
    ]
  }
  return newGrid
}

// Ensure return type is specified, here it should be Cell[][].
export const solveGrid = (grid: Cell[][]): Cell[][] => {
  // Now using strict equality check
  const newGrid = grid.map((row) =>
    row.map((cell) => ({
      ...cell,
      error: cell.value !== 0 // Use strict equality
    }))
  )
  return newGrid
}

// This function should explicitly return GameState.
const getEmptyGameState = (): GameState => {
  return {
    grid: getEmptyGrid(),
    selectedRow: null,
    selectedColumn: null
  }
}

// The component itself is fine, just fixed the imports and related functions.
const Sudoku: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(getEmptyGameState())

  return (
    <div className={styles.mainLayout}>
      <SudokuGrid gameState={gameState} setGameState={setGameState} />
      <SidePanel gameState={gameState} setGameState={setGameState} />
    </div>
  )
}

export default Sudoku
