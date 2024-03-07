'use client'

import React, { useEffect, useState } from 'react';
import SudokuGrid from "@/components/SudokuGrid"; // Assuming this is your main Sudoku grid component
import SidePanel from "@/components/SidePanel";
import styles from './Sudoku.module.scss';

const getEmptyGrid = (gridHeight=9, gridWidth=9): Cell[][] => Array(gridHeight).fill(null).map(() =>
        Array(gridWidth).fill(null).map(() => ({ })) // fill grid with empty cells.
    );


interface GameState { 
	grid: Cell[][];
	selectedRow: number;
	selectedColumn: number;
}

export const setGridCell = (grid:Cell[][], row: number, col: number, value: number, locked: boolean) => {
	const newGrid = [...grid];
	if (newGrid[row]) {
		const updatedCell = { ...newGrid[row][col], value , locked: (value !== 0) && locked };
		newGrid[row] = [
			...newGrid[row].slice(0, col),
			updatedCell,
			...newGrid[row].slice(col + 1)
		];
	}
	return newGrid;
};

export const solveGrid = (grid: Cell[][]) => {
	
		// for now just testing
		const newGrid = grid.map(row => 
			row.map(cell => ({
				...cell,
				error: cell.value != 0  // Set the error flag for all cells
			}))
		);
		return newGrid;
}

const getEmptyGameState = () => {
	return {
		grid: getEmptyGrid(),
		selectedRow: null,
		selectedColumn: null
	}
}

const Sudoku: React.FC = () => {
	const [gameState, setGameState] = useState(getEmptyGameState());

	return (<div className={styles.mainLayout}>
		<SudokuGrid gameState={gameState} setGameState={setGameState} />
		<SidePanel gameState={gameState} setGameState={setGameState}  />
	</div>);
}

export default Sudoku;
