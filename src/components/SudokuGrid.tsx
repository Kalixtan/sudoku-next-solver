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

export const SudokuCell: React.FC<SudokuCellProps> = ({row, column, isSelected, isSelectionAligned, value, onCellClick}) => {
    const classes = [styles.cell];
    if (isSelected) {
        classes.push(styles.selected);
    }
    if (isSelectionAligned){
        classes.push(styles.aligned);
    }
    return <button className={classes.join(' ')} onClick={() => onCellClick(row, column)}>{value}</button>
};

export function SudokuRow({row, cells, selectedRow, selectedColumn, onCellClick}) {
    return <div className={styles.row}>{cells.map((cell: number, column: number) =>
        <SudokuCell
            key={column}
            row={row}
            column={column}
            value={cell}
            isSelectionAligned={selectedRow == row || selectedColumn == column}
            isSelected={selectedColumn == column && selectedRow == row}
            onCellClick={onCellClick}
        />)
    }</div>
}


export default function SudokuGrid({grid}) {
    const [selectedRow, setSelectedRow] = useState();
    const [selectedColumn, setSelectedColumn] = useState();

    const handleCellClick = (row, column) => {
        setSelectedRow(row);
        setSelectedColumn(column);
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
