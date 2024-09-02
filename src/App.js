import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

/**
 * Tic-Tac-Toe Game component
 * Manages the game state, handles user moves, and interacts with the backend API.
 */
function App() {
    const [board, setBoard] = useState([['', '', ''], ['', '', ''], ['', '', '']]);
    const [score, setScore] = useState({ x: 0, o: 0 });
    const [currentTurn, setCurrentTurn] = useState('x');
    const [victory, setVictory] = useState('');

    // Fetch the initial game state from the backend when the component mounts
    useEffect(() => {
        axios.get('http://65.21.255.215/tic-tac-toe/api/game')
            .then(response => {
                setBoard(response.data.board);
                setScore(response.data.score);
                setCurrentTurn(response.data.currentTurn);
                setVictory(response.data.victory);
            })
            .catch(error => {
                console.error('Error fetching game state:', error);
            });
    }, []);

    /**
     * Handles a player's move by sending the move to the backend API.
     * @param {number} x - The x coordinate on the board
     * @param {number} y - The y coordinate on the board
     */
    const handleMove = (x, y) => {
        axios.post(`http://65.21.255.215/tic-tac-toe/api/game/${currentTurn}`, { x, y })
            .then(response => {
                setBoard(response.data.board);
                setScore(response.data.score);
                setCurrentTurn(response.data.currentTurn);
                setVictory(response.data.victory);
            })
            .catch(error => {
                alert(error.response.data.error || 'An error occurred.');
            });
    };

    /**
     * Restarts the game by calling the restart API endpoint.
     */
    const handleRestart = () => {
        axios.post('http://65.21.255.215/tic-tac-toe/api/game/restart')
            .then(response => {
                setBoard(response.data.board);
                setScore(response.data.score);
                setCurrentTurn(response.data.currentTurn);
                setVictory(response.data.victory);
            })
            .catch(error => {
                console.error('Error restarting the game:', error);
            });
    };

    /**
     * Resets the game and scores by calling the reset API endpoint.
     */
    const handleReset = () => {
        axios.delete('http://65.21.255.215/tic-tac-toe/api/game')
            .then(response => {
                setBoard([['', '', ''], ['', '', ''], ['', '', '']]);
                setScore({ x: 0, o: 0 });
                setCurrentTurn(response.data.currentTurn);
                setVictory('');
            })
            .catch(error => {
                console.error('Error resetting the game:', error);
            });
    };

    // Show a loading message if the board has not yet loaded
    if (!board) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Tic-Tac-Toe</h1>
            <div className="board">
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <button
                            key={`${rowIndex}-${colIndex}`}
                            className="cell"
                            onClick={() => handleMove(rowIndex, colIndex)}
                            disabled={victory !== ''}
                        >
                            {cell}
                        </button>
                    ))
                )}
            </div>
            <div className="message">
                {victory ? `${victory.toUpperCase()} wins!` : `Current Turn: ${currentTurn.toUpperCase()}`}
            </div>
            <div className="scoreboard">
                <p>Score X: {score.x}</p>
                <p>Score O: {score.o}</p>
            </div>
            <button onClick={handleRestart}>Restart Game</button>
            <button onClick={handleReset}>Reset All</button>
        </div>
    );
}

export default App;
