# Next.js Sudoku Solver

This project is a web-based Sudoku solver built with [Next.js](https://nextjs.org/),
It offers a user-friendly interface for solving Sudoku puzzles interactively.

You can [try it online here.](https://sudoku-solver-next-js.vercel.app/),

## Features

- **Interactive Sudoku Grid**: Engage with the Sudoku grid directly using mouse controls for easy puzzle input and visualization.
- **Keyboard Shortcuts for "Power Users"**: Utilize hotkeys for efficient puzzle solving:
  - **Arrow keys**: Move the selection around the grid.
  - **Number keys (1-9)**: Place numbers into the Sudoku grid.
  - **Space or Backspace**: Erase the number from the selected cell.
  - **Enter**: Automatically solve the puzzle.
- **"Quick" solveing**: Instantly solve puzzles using a backtracking algorithm, with error detection and highlighting for invalid inputs.
- **Responsive Design**: A mobile-responsive layout ensures a seamless experience on any device.


## Getting Started

First, install all requred modules:

```bash
npm install
```

Then run the development server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

( Let me know if you have any probblems running the project. )
