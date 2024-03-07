'use client'

import React, { useEffect, useState } from 'react';
import { setGridCell } from "./Sudoku";
import styles from "./SudokuGrid.module.scss";

// Define your subgrid and total grid dimensions here (Will be replaced by a simple drop down box, mostly here for testing.)
/*
// 4x4
const sub_grid_w   = 2;
const sub_grid_h   = 2;
const total_grid_w = 4;
const total_grid_h = 4;
*/

/*
// 6x6
const sub_grid_w   = 3;
const sub_grid_h   = 2;
const total_grid_w = 6;
const total_grid_h = 6;
*/

// classic 9x9
const sub_grid_w   = 3;
const sub_grid_h   = 3;
const total_grid_w = 9;
const total_grid_h = 9;

/*
// classic 12x12  [Will not work as we are limited with inputs right now from 1-9]
const sub_grid_w   = 4;
const sub_grid_h   = 3;
const total_grid_w = 12;
const total_grid_h = 12;
*/
/*
// 16x16 [Will not work as we are limited with inputs right now from 1-9]
const sub_grid_w   = 4;
const sub_grid_h   = 4;
const total_grid_w = 16;
const total_grid_h = 16;
*/


interface Cell {
    value: number;
    locked: boolean;
    error: boolean;
}

interface SudokuCellProps {
    row: number;
    col: number;
    cell: Cell;
    selectedRow: number;
    selectedColumn: number;
    onCellClick: (row: number, col: number) => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
    row,
    col,
    cell,
    selectedRow,
    selectedColumn,
    onCellClick
}) => {
    const classes = [styles.cell];
    
    const            isLocked=(cell.locked);
   const             isError=(cell.error);
    const            isSelected=(selectedColumn === col && selectedRow === row);
   const             isSelectionAligned=(
                    selectedRow === row || selectedColumn === col ||
                    (Math.floor(selectedColumn / sub_grid_w) === Math.floor(col / sub_grid_w) &&
                     Math.floor(selectedRow / sub_grid_h) === Math.floor(row / sub_grid_h))
                );
    const            isLineHor=(col % sub_grid_w === sub_grid_w - 1 && col !== total_grid_w - 1);
    const            isLineVer=(row % sub_grid_h === sub_grid_h - 1 && row !== total_grid_h - 1);
    const           isValueShown=cell.value !== 0;
    
    if (isValueShown) classes.push(styles.value);
    if (isLocked) classes.push(styles.locked);
    if (isSelected) classes.push(styles.selected);
    if (isSelectionAligned) classes.push(styles.aligned);
    if (isLineHor) classes.push(styles.lineHor);
    if (isLineVer) classes.push(styles.lineVer);
    if (isError) classes.push(styles.error);
    
    return (
        <button 
            className={classes.join(' ')} 
            onClick={() => onCellClick(row, col)}
        >
            {cell.value ? cell.value : ''}
        </button>
    );
};

export default function SudokuGrid({gameState, setGameState}) {
	const grid = gameState.grid;
    const setGrid = (newGrid) => setGameState( (old)=> ({...old, grid: newGrid}) ); 

    const setCell = (row: number, col: number, num: number, locked: boolean) => {
		setGrid(setGridCell(grid, row, col, num, locked));
    };

	const setSelected = (row, col) => setGameState( (old)=> ({...old, selectedRow: row, selectedColumn: col }) ); 
    const clearSolvedAndErrors = () => {
		const newGrid = grid.map(row => 
			row.map(cell => ({
				...cell,
				value: cell.locked ? cell.value : 0, // clears solusion
				error: false // Set the error flag for all cells
			}))
		);
		setGrid( newGrid ); 
    };
    
    const runSolver = () => {
		setGrid( solveGrid(grid) );
    };

    const handleCellClick = (row: number, col: number) => {
		console.log(row,col)
        clearSolvedAndErrors();
        setSelected(row, col);
     
    };


	// As websites dont tend to use the keyboard, these are all optional input method for power users and helps when testing as mouse controls are slow.
	// (I prefer to use these shortcuts)
    const handleKeyDown = (event: KeyboardEvent) => {
        clearSolvedAndErrors();
        
       
        
        // Prevent default behavior for Enter and Space keys
        if (event.key === ' ' || event.key === 'Tab' || event.key === 'Enter') {
            event.preventDefault();
        }
        
        switch (event.key) {
			// Move the sellected cell around useing arrow keys.
            case 'ArrowUp':
				setSelected(Math.max(0, gameState.selectedRow - 1), gameState.selectedColumn);
                break;
            case 'ArrowDown':
				setSelected(Math.min(grid.length - 1, gameState.selectedRow + 1), gameState.selectedColumn );
               
                break;
            case 'ArrowLeft':
                setSelected(gameState.selectedRow, Math.max(0, gameState.selectedColumn - 1) );
                break;
            case 'ArrowRight':
            setSelected(gameState.selectedRow, Math.min(grid[0].length - 1, gameState.selectedColumn + 1) );

                break;
            // Clear cell.
            case 'Backspace':
            case 'Delete':
            case ' ':
                setCell(gameState.selectedRow, gameState.selectedColumn, 0, false);
                break;
            // Run solver
			case 'Enter':
				runSolver();
				break;
            default:
                if (event.key >= '1' && event.key <= '9') { // Add number to cell.
                    setCell(gameState.selectedRow, gameState.selectedColumn, parseInt(event.key), true);
                }
                break;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [gameState]);

    return <div className={styles.grid} tabIndex={0}>
        {grid.map((rowCells, rowIndex) => (
			<div key={rowIndex} className={styles.row}>{
				rowCells.map((cell, colIndex) => (
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
    </div>;
}

