'use client'

import React, { useEffect, useState } from 'react';
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
    column: number;
    isSelected: boolean;
    isSelectionAligned: boolean;
    value: number;
    isLocked: boolean;
    onCellClick: (row: number, column: number) => void;
    isLineHor: boolean;
    isLineVer: boolean;
    isValueShown: boolean;
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
    isError,
    onCellClick
}) => {
    const classes = [styles.cell];
    
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
            onClick={() => onCellClick(row, column)}
        >
            {value ? value : ''}
        </button>
    );
};

export function SudokuRow({
    row,
    cells,
    selectedRow,
    selectedColumn,
    onCellClick
}: {
    row: number;
    cells: Cell[];
    selectedRow: number;
    selectedColumn: number;
    onCellClick: (row: number, column: number) => void;
}) {
    return <div className={styles.row}>{
        cells.map((cell, col) => (
            <SudokuCell
                key={col}
                row={row}
                column={col}
                value={cell.value}
                isLocked={cell.locked}
                isError={cell.error}
                isSelected={selectedColumn === col && selectedRow === row}
                isSelectionAligned={
                    selectedRow === row || selectedColumn === col ||
                    (Math.floor(selectedColumn / sub_grid_w) === Math.floor(col / sub_grid_w) &&
                     Math.floor(selectedRow / sub_grid_h) === Math.floor(row / sub_grid_h))
                }
                isLineHor={col % sub_grid_w === sub_grid_w - 1 && col !== total_grid_w - 1}
                isLineVer={row % sub_grid_h === sub_grid_h - 1 && row !== total_grid_h - 1}
                isValueShown={cell.value !== 0}
                onCellClick={onCellClick}
            />
        ))}
    </div>;
}

export default function SudokuGrid() {
    const emptyGrid: Cell[][] = Array(total_grid_h).fill(null).map(() =>
        Array(total_grid_w).fill(null).map(() => ({ })) // fill grid with empty cells.
    );
    
    const [grid, setGrid] = useState(emptyGrid);
    const [selectedRow, setSelectedRow] = useState(0);
    const [selectedColumn, setSelectedColumn] = useState(0);


    const clearSolvedAndErrors = () => {
		const newGrid = grid.map(row => 
			row.map(cell => ({
				...cell,
				//value: cell.locked ? cell.value : 0,
				locked: false,
				error: false // Set the error flag for all cells
			}))
		);
		setGrid(newGrid); // Update the entire grid
    };

    const handleCellClick = (row: number, col: number) => {
		console.log(row,col)
        clearSolvedAndErrors();
        setSelectedRow(row);
        setSelectedColumn(col);
    };

    const setCell = (row: number, col: number, num: number, locked: boolean) => {
        const newGrid = [...grid];
        if (newGrid[row]) {
            const updatedCell = { ...newGrid[row][col], value: num, locked: (num !== 0) && locked };
            newGrid[row] = [
                ...newGrid[row].slice(0, col),
                updatedCell,
                ...newGrid[row].slice(col + 1)
            ];
            setGrid(newGrid);
        }
    };

	// As websites dont tend to use the keyboard, these are all optional input method for power users and helps when testing as mouse controls are slow.
	// (I prefer to use these shortcuts)
    const handleKeyDown = (event: KeyboardEvent) => {
        clearSolvedAndErrors();
        
        // Prevent default behavior for Enter and Space keys
        if (event.key === ' ' || event.key === 'Enter') {
            event.preventDefault();
        }
        
        switch (event.key) {
			// Move the sellected cell around useing arrow keys.
            case 'ArrowUp':
                setSelectedRow(prevRow => Math.max(0, prevRow - 1));
                break;
            case 'ArrowDown':
                setSelectedRow(prevRow => Math.min(grid.length - 1, prevRow + 1));
                break;
            case 'ArrowLeft':
                setSelectedColumn(prevCol => Math.max(0, prevCol - 1));
                break;
            case 'ArrowRight':
                setSelectedColumn(prevCol => Math.min(grid[0].length - 1, prevCol + 1));
                break;
            // Clear cell.
            case 'Backspace':
            case 'Delete':
                setCell(selectedRow, selectedColumn, 0, false);
                break;
            // Run solver
			case 'Enter':
				// for now just testing
				const newGrid = grid.map(row => 
					row.map(cell => ({
						...cell,
						error: cell.value == 1  // Set the error flag for all cells
					}))
				);
				setGrid(newGrid); // Update the entire grid
				break;
            default:
                if (event.key >= '1' && event.key <= '9') { // Add number to cell.
                    setCell(selectedRow, selectedColumn, parseInt(event.key), true);
                }
                break;
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedRow, selectedColumn, grid]); // Depend on selectedRow, selectedColumn, and grid so the effect updates with state

    return <div className={styles.grid} tabIndex={0}>
        {grid.map((cells, index) => (
            <SudokuRow
                key={index}
                row={index}
                cells={cells}
                selectedRow={selectedRow}
                selectedColumn={selectedColumn}
                onCellClick={handleCellClick}
            />
        ))}
    </div>;
}

