'use client'

import React, { useEffect, useState } from 'react';
import styles from "./SudokuGrid.module.scss";

/*
// 6x6
const sub_grid_w   = 3;
const sub_grid_h   = 2;
const total_grid_w = 6;
const total_grid_h = 6;
*/
/*
// 4x4
const sub_grid_w   = 2;
const sub_grid_h   = 2;
const total_grid_w = 4;
const total_grid_h = 4;
*/

// classic 9x9
const sub_grid_w   = 3;
const sub_grid_h   = 3;
const total_grid_w = 9;
const total_grid_h = 9;

/*
// 16x16 [Will not work as we are limited with inputs right now from 1-9]
const sub_grid_w   = 4;
const sub_grid_h   = 4;
const total_grid_w = 16;
const total_grid_h = 16;
*/

interface SudokuCellProps {
    row: number;
    column: number;
    isSelected: boolean;
    isSelectionAligned: boolean;
    value?: number;
    onCellClick: (row: number, column: number) => void;
}

export const SudokuCell: React.FC<SudokuCellProps> = ({
    row,
    column,
    isSelected,
    isSelectionAligned,
    isLineHor,
    isLineVer,
    isValueShown,
    value,
    isLocked,
    onCellClick
}) => {
    const classes = [styles.cell];
    
    if (isValueShown) classes.push(styles.value);
    if (isLocked) classes.push(styles.locked);
    if (isSelected) classes.push(styles.selected);
    if (isSelectionAligned) classes.push(styles.aligned);
    if (isLineHor) classes.push(styles.lineHor);
    if (isLineVer) classes.push(styles.lineVer);
    
    return (
        <button 
            className={classes.join(' ')} 
            onClick={() => onCellClick(row, column)}
        >
            {value ? value : ''}
        </button>
    );
};



export function SudokuRow({row, cells, selectedRow, selectedColumn, onCellClick}) {
    return <div className={styles.row}>{
        cells.map((cell, col) => (
            <SudokuCell
                key={col}
                row={row}
                column={col}
                value={cell.value}
                isLocked={cell.locked}
                isSelected={selectedColumn == col && selectedRow == row}
                isSelectionAligned={
                    selectedRow == row || selectedColumn == col ||
                    (Math.floor(selectedColumn/sub_grid_w) == Math.floor(col/sub_grid_w) &&
                     Math.floor(selectedRow/sub_grid_h) == Math.floor(row/sub_grid_h))
                }
                isLineHor={col % sub_grid_w == sub_grid_w-1 && col != total_grid_w-1}
                isLineVer={row % sub_grid_h == sub_grid_h-1 && row != total_grid_h-1}
                isValueShown={cell.value != 0}
                onCellClick={onCellClick}
            />
        ))}
    </div>;
}

export default function SudokuGrid() {
	const emptyGrid = Array(total_grid_h).fill(null).map(() =>
		Array(total_grid_w).fill(null).map(() => ({ value: 0, locked: false }))
	);
	
    const [grid, setGrid] = useState(emptyGrid); // Copy initial grid into state
    const [selectedRow, setSelectedRow] = useState(0);
    const [selectedColumn, setSelectedColumn] = useState(0);

    const handleCellClick = (row, col) => {
        setSelectedRow(row);
        setSelectedColumn(col);
    };

    // Incorporate SetCell logic directly here
	const setCell = (row, col, num, locked) => {
		const newGrid = [...grid]; // Clone the grid for immutability
		//if (newGrid[row] && !newGrid[row][col].locked) { // Check if the cell exists is not locked
		if (newGrid[row] ) { // Check if the cell exists is not locked
			const updatedCell = { ...newGrid[row][col], value: num, locked: num != 0 && locked }; // Update the cell
			newGrid[row] = [
				...newGrid[row].slice(0, col),
				updatedCell,
				...newGrid[row].slice(col + 1)
			];
			setGrid(newGrid);
		}
	};


    const handleKeyDown = (event) => {
		console.log(event.key)
        switch (event.key) {
            case 'ArrowUp':
                setSelectedRow((prevRow) => Math.max(0, prevRow - 1));
                break;
            case 'ArrowDown':
                setSelectedRow((prevRow) => Math.min(grid.length - 1, prevRow + 1));
                break;
            case 'ArrowLeft':
                setSelectedColumn((prevCol) => Math.max(0, prevCol - 1));
                break;
            case 'ArrowRight':
                setSelectedColumn((prevCol) => Math.min(grid[0].length - 1, prevCol + 1));
                break;
            case 'Backspace':// clear cell
            case 'Delete':
                setCell(selectedRow, selectedColumn, 0, false); // not working
                break;
            default: // add number to cell
                if (event.key >= '0' && event.key <= '9') {
                    setCell(selectedRow, selectedColumn, parseInt(event.key), true);
                }
                break;
        }
    };

    // Effect to add and remove the event listener
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedRow, selectedColumn, grid]); // Depend on selectedRow, selectedColumn, and grid so the effect updates with state

    return <div className={styles.grid} tabIndex={0}>
        {grid.map((cells, index) =>
            <SudokuRow
                key={index}
                row={index}
                cells={cells}
                selectedRow={selectedRow}
                selectedColumn={selectedColumn}
                onCellClick={handleCellClick}
            />)}
    </div>;
}
