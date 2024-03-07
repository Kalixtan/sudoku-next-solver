import React from 'react';
import { setGridCell } from "./Sudoku";
import styles from './SidePanel.module.scss';
import Image from 'next/image';
import EraserIcon from "./icons/eraser.svg";
import SolveIcon from "./icons/solve.svg";

const SidePanel: React.FC = ({gameState, setGameState}) => {
    const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

	const grid = gameState.grid;
    const setGrid = (newGrid) => setGameState( (old)=> ({...old, grid: newGrid}) ); 

    const setCell = (row: number, col: number, num: number, locked: boolean) => {
		setGrid(setGridCell(grid, row, col, num, locked));
    };

    return (
        <div className={styles.sidePanel}>
            {numberButtons.map((number, index) => (
                // Render three buttons per row
                index % 3 === 0 && (
                    <div className={styles.row} key={`row-${Math.floor(index / 3)}`}>
                        {numberButtons.slice(index, index + 3).map(value => (
                            <button 
                                key={value}
                                className={`${styles.panelButton} ${styles.squareButton}`}
                                onClick={() => setCell(gameState.selectedRow, gameState.selectedColumn, value, true)}
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                )
            ))}
            <div className={styles.row}>
				
                <button className={`${styles.panelButton} ${styles.eraseButton}`} onClick={() => setCell(gameState.selectedRow, gameState.selectedColumn, 0, false)}>
					<EraserIcon />
					Erase
                </button>
            </div>
            <div className={styles.row}>
                <button className={`${styles.panelButton} ${styles.solveButton}`}><SolveIcon />Solve</button>
            </div>
        </div>
    );
};

export default SidePanel;
