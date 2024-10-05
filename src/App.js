// import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

/*
Square component: Renders a single button
props:
- value: The value to be displayed inside the button (e.g., "X", "O", or null)
- onSquareClick: Function to be called when the button is clicked
*/
function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

/*
Board component: Manages the state and logic for the Tic-Tac-Toe game
props:
- xIsNext: A boolean indicating if the next move is for player 'X' (true) or 'O' (false)
- squares: An array representing the current state of the board (each index is either 'X', 'O', or null)
- onPlay: A function to update the state after a move is made
*/
function Board({ xIsNext, squares, onPlay }) {
  // Handles the logic when a square is clicked
  // - i: The index of the clicked square
  function handleClick(i) {
    // Return early if there's already a winner or if the square is already occupied
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    // Create a copy of the squares array to update the board state
    const nextSquares = squares.slice();

    // Update the square with 'X' if it's player 'X's turn, otherwise 'O'
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }

    // Pass the updated board state back to the parent component through the onPlay function
    onPlay(nextSquares);
  }

  // Determine if there's a winner
  const winner = calculateWinner(squares);
  // Define the game status: either the winner or the next player's turn
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // Render the Tic-Tac-Toe board with 9 squares & the predefined game status
  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

/*
Game component: The main component that manages the entire state of the Tic-Tac-Toe game.
functions:
- Track the game history & current move
- Provides functionality to handle gameplay and time travel
*/
export default function Game() {
  // State for storing the history of moves as an array of arrays. Each array represents a board state.
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // State for tracking the index of the current move in the game history.
  const [currentMove, setCurrentMove] = useState(0);

  // A boolean indicating whether the next move is by player 'X'. It is true if the move number is even.
  const xIsNext = currentMove % 2 === 0;
  
  // The current state of the board, which is based on the move number from the history.
  const currentSquares = history[currentMove];

  // handlePlay function: Updates the game state after a move is made.
  // - nextSquares: The updated array representing the new board state after a move.
  function handlePlay(nextSquares) {
    // Creates a new history that includes only the moves up to the current move and the new board state.
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];

    // Updates the history state with the new board state and sets the current move to the latest move.
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  // jumpTo function: Allows the player to "jump" back to a previous move in the history.
  // - nextMove: The move number to jump to.
  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Generate a list of buttons that allow the player to travel through game history.
  // Each button displays a description of the move number.
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Go to move #' + move;
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // Render the Game component with two sections: the game board and the move history.
  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

/*
calculateWinner function: Determines if there is a winning line in the current state of the Tic-Tac-Toe board.
- squares: An array of 9 elements representing the current state of the board, where 'X', 'O', or null values can be present.
*/
function calculateWinner(squares) {
  // Array of possible winning lines. Each sub-array represents a set of indices in the squares array
  // that form a winning combination (either a row, column, or diagonal).
  const lines = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6]  // Diagonal from top-right to bottom-left
  ];

  // Iterate through each possible winning line.
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];   // Destructure the indices for the current winning line.

    // Check if the squares at these indices are non-null and contain the same value ('X' or 'O').
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];          // Return the value ('X' or 'O') if a winning line is found.
    }
  }
  return null;                    // If no winner is found, return null.
}