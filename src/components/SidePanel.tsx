import React from 'react'
import { setGridCell } from './Sudoku'
import styles from './SidePanel.module.scss'
import EraserIcon from './icons/eraser.svg'
import SolveIcon from './icons/solve.svg'

interface GameState {
  selectedRow: number
  selectedColumn: number
  grid: Cell[][]
}

interface Props {
  gameState: GameState
  setGameState: (update: (oldState: GameState) => GameState) => void
}

const SidePanel: React.FC<Props> = ({ gameState, setGameState }): void => {
  const numberButtons: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9]

  const grid: Cell[][] = gameState.grid
  const setGrid = (newGrid: Cell[][]): void => { setGameState((old: GameState) => ({ ...old, grid: newGrid })) }

  const setCell = (row: number, col: number, num: number, locked: boolean): void => {
    setGrid(setGridCell(grid, row, col, num, locked))
  }

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
                    setCell(
                      gameState.selectedRow,
                      gameState.selectedColumn,
                      value,
                      true
                    )
                  }}
                >
                  {value}
                </button>
              ))}
            </div>
          )
      )}
      <div className={styles.row}>
        <button
          className={`${styles.panelButton} ${styles.eraseButton}`}
          onClick={() => {
            setCell(gameState.selectedRow, gameState.selectedColumn, 0, false)
          }}
        >
          <EraserIcon />
          Erase
        </button>
      </div>
      <div className={styles.row}>
        <button className={`${styles.panelButton} ${styles.solveButton}`}>
          <SolveIcon />
          Solve
        </button>
      </div>
    </div>
  )
}

export default SidePanel
