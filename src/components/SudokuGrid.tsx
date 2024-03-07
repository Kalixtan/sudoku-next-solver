'use client'
import React, { useEffect } from 'react'
import { setGridCell, solveGrid } from './Sudoku'
import styles from './SudokuGrid.module.scss'

interface Cell {
  value: number
  locked: boolean
  error: boolean
}

interface GameState {
  grid: Cell[][]
  selectedRow: number
  selectedColumn: number
}

interface SudokuCellProps {
  row: number
  col: number
  cell: Cell
  selectedRow: number
  selectedColumn: number
  onCellClick: (row: number, col: number) => void
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
  row,
  col,
  cell,
  selectedRow,
  selectedColumn,
  onCellClick
}) => {
  const classes = [styles.cell]

  const isSelected = selectedColumn === col && selectedRow === row
  const isSelectionAligned =
    selectedRow === row ||
    selectedColumn === col ||
    (Math.floor(selectedColumn / 3) === Math.floor(col / 3) &&
      Math.floor(selectedRow / 3) === Math.floor(row / 3))
  const isLineHor = col % 3 === 2 && col !== 8
  const isLineVer = row % 3 === 2 && row !== 8

  if (cell.value !== 0) classes.push(styles.value)
  if (cell.locked) classes.push(styles.locked)
  if (isSelected) classes.push(styles.selected)
  if (isSelectionAligned) classes.push(styles.aligned)
  if (isLineHor) classes.push(styles.lineHor)
  if (isLineVer) classes.push(styles.lineVer)
  if (cell.error) classes.push(styles.error)

  return (
    <button
      className={classes.join(' ')}
      onClick={() => { onCellClick(row, col) }}
    >
      {cell.value ?? ''}
    </button>
  )
}

interface SudokuGridProps {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
}

const SudokuGrid: React.FC<SudokuGridProps> = ({ gameState, setGameState }) => {
  const setGrid = (newGrid: Cell[][]): void => {
    setGameState((old: GameState) => ({ ...old, grid: newGrid }))
  }

  const setCell = (row: number, col: number, num: number, locked: boolean): void => {
    const newGrid = setGridCell(gameState.grid, row, col, num, locked)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setGrid(newGrid)
  }

  const setSelected = (row: number, col: number): void => {
    setGameState((old) => ({
      ...old,
      selectedRow: row,
      selectedColumn: col
    }))
  }

  const clearSolvedAndErrors = (): void => {
    const newGrid = gameState.grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        value: cell.locked ? cell.value : 0, // Clears solution
        error: false // Sets the error flag for all cells to false
      }))
    )
    setGrid(newGrid)
  }

  const runSolver = (): void => {
    const newGrid = solveGrid(gameState.grid)
    setGrid(newGrid)
  }

  const handleCellClick = (row: number, col: number): void => {
    clearSolvedAndErrors()
    setSelected(row, col)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (gameState.selectedRow !== null && gameState.selectedColumn !== null) {
        // Prevent default behavior for certain keys
        if ([' ', 'Tab', 'Enter'].includes(event.key)) {
          event.preventDefault()
        }

        switch (event.key) {
          case 'ArrowUp':
            setSelected(Math.max(0, gameState.selectedRow - 1), gameState.selectedColumn)
            break
          case 'ArrowDown':
            setSelected(Math.min(gameState.grid.length - 1, gameState.selectedRow + 1), gameState.selectedColumn)
            break
          case 'ArrowLeft':
            setSelected(gameState.selectedRow, Math.max(0, gameState.selectedColumn - 1))
            break
          case 'ArrowRight':
            setSelected(gameState.selectedRow, Math.min(gameState.grid[0].length - 1, gameState.selectedColumn + 1))
            break
          case 'Backspace':
          case 'Delete':
          case ' ':
            setCell(gameState.selectedRow, gameState.selectedColumn, 0, false)
            break
          case 'Enter':
            runSolver()
            break
          default:
            if (event.key >= '1' && event.key <= '9') {
              setCell(gameState.selectedRow, gameState.selectedColumn, parseInt(event.key), true)
            }
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => { window.removeEventListener('keydown', handleKeyDown) }
  }, [gameState])

  return (
    <div className={styles.grid} tabIndex={0}>
      {gameState.grid.map((rowCells, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {rowCells.map((cell, colIndex) => (
            <SudokuCell
              key={colIndex}
              row={rowIndex}
              col={colIndex}
              cell={cell}
              selectedRow={gameState.selectedRow}
              selectedColumn={gameState.selectedColumn}
              onCellClick={handleCellClick}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default SudokuGrid
