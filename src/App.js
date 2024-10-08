import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://65.21.255.215/tic-tac-toe/api/game';

/**
 * Tic-Tac-Toe Game component
 * Manages the game state, handles user moves, and interacts with the backend API.
 */
function App() {
    const [board, setBoard] = useState([['', '', ''], ['', '', ''], ['', '', '']]);
    const [score, setScore] = useState({ x: 0, o: 0 });
    const [currentTurn, setCurrentTurn] = useState('x');
    const [victory, setVictory] = useState('');
    const [showOverlay, setShowOverlay] = useState(false);

    // Fetch the initial game state from the backend when the component mounts
    useEffect(() => {
        axios.get(`${API_URL}`)
            .then(response => {
                setBoard(response.data.board);
                setScore(response.data.score);
                setCurrentTurn(response.data.currentTurn);
                setVictory(response.data.victory);
                if (response.data.victory) {
                    setShowOverlay(true);
                }
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
        axios.post(`${API_URL}/${currentTurn}`, { x, y })
        .then(response => {
            setBoard(response.data.board);
            setScore(response.data.score);
            setCurrentTurn(response.data.currentTurn);
            setVictory(response.data.victory);
            if (response.data.victory) {
                setShowOverlay(true);
            }
        })
        .catch(error => {
            alert(error.response.data.error);
        });
    };

    /**
     * Restarts the game by calling the restart API endpoint.
     */
    const handleRestart = () => {
        axios.post(`${API_URL}/restart`)
            .then(response => {
                setBoard(response.data.board);
                setScore(response.data.score);
                setCurrentTurn(response.data.currentTurn);
                setVictory(response.data.victory);
                setShowOverlay(false);
            })
            .catch(error => {
                console.error('Error restarting the game:', error);
            });
    };

    /**
     * Resets the game and scores by calling the reset API endpoint.
     */
    const handleReset = () => {
        axios.delete(`${API_URL}`)
            .then(response => {
                setBoard([['', '', ''], ['', '', ''], ['', '', '']]);
                setScore({ x: 0, o: 0 });
                setCurrentTurn(response.data.currentTurn);
                setVictory('');
                setShowOverlay(false);
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

            {showOverlay && (
                <div className="overlay">
                    <div className="overlay-content">
                        <h2>{victory.toUpperCase()} Wins!</h2>
                        <button onClick={() => setShowOverlay(false)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
