import { useState } from "react";

import Player from "./components/Player.jsx";
import GameBoard from "./components/GameBoard.jsx";
import Log from "./components/Log.jsx";
import GameOver from "./components/GameOver.jsx";

import { WINNING_COMBINATIONS } from "./winning-combination.js";


const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
]

function deriveActivePlayer(gameTurns) {
  let activePlayer = "X"

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    activePlayer = "O"
  };

  return activePlayer;
};

function deriveWinner(gameBoard,playersNames ){
  let winner = null; 

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[combination[0].row][combination[0].column] ;
    const secondSquareSymbol = gameBoard[combination[1].row][combination[1].column] ;
    const thirdSquareSymbol = gameBoard[combination[2].row][combination[2].column] ;

    if (firstSquareSymbol && firstSquareSymbol === secondSquareSymbol && firstSquareSymbol === thirdSquareSymbol){
      winner = playersNames[firstSquareSymbol]
    };

  };

  return winner;
};

function deriveGameBoard(gameTurns){
  let gameBoard = [...initialGameBoard].map(array => [...array]);

  for (const turn of gameTurns) {
      const {square, player} = turn; 
      const {row, col} = square;

      gameBoard[row][col] = player;
  }

  return gameBoard;
};


function App() {
 
  const [gameTurns, setGameTurns] = useState([]);
  const [playersNames, setPlayersNames] = useState({
    "X" : "Player1",
    "O" : "Player2"
  })


  const gameBoard = deriveGameBoard(gameTurns)
  const winner = deriveWinner(gameBoard, playersNames)
  const hasDraw = (gameTurns.length === 9 && !winner)
  const currentPlayer = deriveActivePlayer(gameTurns);



  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((previousTurn) => {
      
      const currentPlayer = deriveActivePlayer(previousTurn);

      const updatedTurns = [{square: {row: rowIndex, col: colIndex}, player: currentPlayer }, ...previousTurn];

      return updatedTurns
    })
  };

  function handleRestart(){
    setGameTurns([])
  };

  function handlePlayerNameChange(symbol, newName){
    setPlayersNames(previousNames => {
      return {
        ...previousNames,
        [symbol] : newName,
      }
    })

  };

  return (
    <main>
      <div id="game-container">
        <ol id="players" className="highlight-player">
          <Player initialName="player1" symbol="X" isActive={currentPlayer === 'X'} onChangeName = {handlePlayerNameChange}></Player>
          <Player initialName="player2" symbol="O" isActive={currentPlayer === 'O'} onChangeName = {handlePlayerNameChange}></Player>
        </ol>
        {(winner || hasDraw) && <GameOver winner={winner} onRestart={handleRestart}/>}
        <GameBoard onSelectSquare={handleSelectSquare} activeSymbol={currentPlayer} board={gameBoard}/>
      </div>
      <Log turns={gameTurns}/>
    </main>
  )
}

export default App
