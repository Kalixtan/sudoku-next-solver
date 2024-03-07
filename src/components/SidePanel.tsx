import React from 'react';
import styles from './SidePanel.module.scss';

const SidePanel: React.FC = () => {
    const numberButtons = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
                            >
                                {value}
                            </button>
                        ))}
                    </div>
                )
            ))}
            <div className={styles.row}>
                <button className={`${styles.panelButton} ${styles.eraseButton}`}>Erase</button>
            </div>
            <div className={styles.row}>
                <button className={`${styles.panelButton} ${styles.solveButton}`}>Solve</button>
            </div>
        </div>
    );
};

export default SidePanel;
