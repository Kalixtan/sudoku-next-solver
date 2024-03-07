

import React from 'react';
import SudokuGrid from "@/components/SudokuGrid"; // Assuming this is your main Sudoku grid component
import SidePanel from "@/components/SidePanel";;
import styles from './MainLayout.module.scss'; // If you have separate styles for layout

const MainLayout: React.FC = () => {

    return (
        <main className={styles.main}>
        <div className={styles.mainLayout}>
				<SudokuGrid/>
				<SidePanel/>
        </div>
        </main>
    );
};

export default MainLayout;

