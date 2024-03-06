'use client'

import {FC, useState} from "react";
import styles from "./SudokuGrid.module.scss";


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
    onCellClick
}) => {
    const classes = [styles.cell];
    
    if (isValueShown) {
        classes.push(styles.value);
    }
    
    //* //Extra grid lines
    if (isLineHor) {
        classes.push(styles.lineHor);
    }
    if (isLineVer) {
        classes.push(styles.lineVer);
    }
    //*/
    
     // cells
    if (isSelected) {
        classes.push(styles.selected);
    }
    
     // is alinged to the sellected cell
    if (isSelectionAligned) {
        classes.push(styles.aligned);
    }
    
    return <button className={classes.join(' ')} onClick={() => onCellClick(row, column)}>{value}</button>;
};


export function SudokuRow({row, cells, selectedRow, selectedColumn, onCellClick}) {

    return <div className={styles.row}>{
        cells.map((cell, col) =>
            <SudokuCell
                key={col}
                row={row}
                column={col}
                value={cell}
                isSelectionAligned={
					selectedRow == row || selectedColumn == col || // direct col/ver
					(
						Math.floor(selectedColumn/3) == Math.floor(col/3) &&
						Math.floor(selectedRow/3)    == Math.floor(row/3)
					)
				}
                isSelected={ selectedColumn == col && selectedRow == row}
                
                isLineHor={col%3 == 2 && col != 8 } // Horizontal lines.
                isLineVer={row%3 == 2 && row != 8 } // Vertical lines.
                isValueShown={ cell != 0 } // if not 0 the number should be shown.
                
                
                onCellClick={onCellClick}
            />)
        }</div>
}



export default function SudokuGrid({grid}) {
    const [selectedRow, setSelectedRow] = useState();
    const [selectedColumn, setSelectedColumn] = useState();

    const handleCellClick = (row, col) => {
		console.log(row, col);
        setSelectedRow(row);
        setSelectedColumn(col);
    }

    return <div className={styles.grid}>
        {grid.map((cells, index) =>
            <SudokuRow
                key={index}
                row={index}
                cells={cells}
                selectedRow={selectedRow}
                selectedColumn={selectedColumn}
                onCellClick={handleCellClick}
            />)}
    </div>
}
