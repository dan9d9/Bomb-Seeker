import React, { useState, useEffect } from 'react';
import './App.css';
import bomb from './bomb.png';
import MenuHeader from './components/MenuHeader';
import GameGrid from './components/GameGrid';
import Counters from './components/Counters';
import EndGameModal from './components/EndGameModal';
import HighScoresModal from './components/HighScoresModal';
import { placeMines, clearSquares } from './squaresLogic';

function App() { 
  const [ gameDifficulty, setGameDifficulty ] = useState('Beginner');
  const [ boardWidth, setBoardWidth ] = useState();
  const [ totalSquares, setTotalSquares ] = useState();
  const [ buttonArray, setButtonArray ] = useState([]);
  const [ startingMines, setStartingMines ] = useState();
  const [ mines, setMines ] = useState(0);
  const [ firstClick, setFirstClick ] = useState(true);
  const [ numSeconds, setNumSeconds ] = useState(0);
  const [ intervalID, setIntervalID ] = useState('');
  const [ timeoutID, setTimeoutID ] = useState('');
  const [ uncoveredSquares, setUncoveredSquares ] = useState(0);
  const [ isDisabled, setIsDisabled ] = useState(false);
  const [ newGame, setNewGame ] = useState(true);
  const [ gameOver, setGameOver ] = useState('');
  const [ showMenu, setShowMenu ] = useState(false);
  const [ showHelp, setShowHelp ] = useState(false);
  const [ showHighScores, setShowHighScores ] = useState(false);

  function setBeginnerBoard() {
    setBoardWidth(9);
    setTotalSquares(9 * 9);
    setStartingMines(10);
    setMines(10);
  }

  function setIntermediateBoard() {
    setBoardWidth(16);
    setTotalSquares(16 * 16);
    setStartingMines(40);
    setMines(40);
  }

  function setExpertBoard() {
    setBoardWidth(30);
    setTotalSquares(30 * 16);
    setStartingMines(99);
    setMines(99);
  }


// Set board on newGame === true. On app load, beginner board is set.
  useEffect(() => {
    if(newGame) {
      setTimeoutID('');
      setIntervalID('');
      setGameOver('');
      setUncoveredSquares(0);
      setFirstClick(true);
      setNumSeconds(0);
      gameDifficulty === 'Beginner'
      ? setBeginnerBoard()
      : gameDifficulty === 'Intermediate'
        ? setIntermediateBoard()
        : setExpertBoard();
    }  
  }, [newGame, gameDifficulty]);


// Set all squares with initial properties and end newGame preparation
  useEffect(() => {
    if(newGame && totalSquares) {
      let tempArray = [];
      for(let i=0;i<totalSquares;i++) {
        tempArray.push({
          idx: i,
          isMine: false,
          isFlag: false,
          show: false,
          mineNumber: 0
        });
      }
      setButtonArray([...tempArray]);
      setNewGame(false);
    }
    
  }, [newGame, totalSquares]);


// Update uncoveredSquares when squares are clicked
  useEffect(() => {
    let tempSquares = buttonArray.filter(btn => btn.show === true);
    setUncoveredSquares(tempSquares.length); 
  }, [buttonArray]);


// Listen for win condition
  useEffect(() => {
    if(totalSquares - uncoveredSquares === startingMines) {
      endGame('win')
    }
  }, [uncoveredSquares, startingMines, totalSquares]);


// Handle square click. 
  const handleClick = e => {
    if(!e.target.dataset.clickable || isDisabled) {return}
    const clickedIdx = Number(e.target.dataset.idx);
    const tempArray = [...buttonArray];

// Handle first click of game
    if(firstClick === true) {
      let preparedBoard = placeMines(clickedIdx, tempArray, mines, boardWidth, totalSquares);
      setButtonArray([...preparedBoard]);
      setFirstClick(false);
      const secondsTimer = setInterval(() => {
        setNumSeconds(numSeconds => numSeconds + 1);
      }, 1000);
      setIntervalID(secondsTimer);
    }

// Handle clicking a mine
    if(buttonArray[clickedIdx].isMine) {
      tempArray.forEach(btn => {
        if(btn.isMine) {btn.show = true}
      });

      setButtonArray([...tempArray]);
      endGame('lose');
    }

// Handle clicking any other square
    const clearedBoard = clearSquares(clickedIdx, tempArray, boardWidth, totalSquares);
    setButtonArray([...clearedBoard]);
  }


// Handle right click
  const handleRightClick = e => {
    e.preventDefault();
    if(!e.target.dataset.clickable || isDisabled) {return}

    const clickedIdx = Number(e.target.dataset.idx);
    let tempArray = [...buttonArray];
    let tempMines = mines;

    if(tempArray[clickedIdx].show === true) {return}

    if(!tempArray[clickedIdx].isFlag) {
      if(tempMines > 0) {
        tempArray[clickedIdx].isFlag = true;
        tempMines--;    
      }
    }else {
      tempArray[clickedIdx].isFlag = false;
      tempMines++;  
    }

    setMines(tempMines);
    setButtonArray([...tempArray]);
  }


// Handle new game controls
  const openMenu = () => {
    setShowMenu(showMenu => !showMenu);
  }

  const closeHighScores = () => {
    setShowHighScores(false);
  }

  const controlMenu = e => {
    setShowMenu(false);

    if(e.target.textContent === 'Beginner') {
      setTotalSquares(0);
      setGameDifficulty('Beginner');   
      setNewGame(true);
    }else if(e.target.textContent === 'Intermediate') {
      setTotalSquares(0);
      setGameDifficulty('Intermediate');
      setNewGame(true);
    }else if(e.target.textContent === 'Expert') {
      setTotalSquares(0);
      setGameDifficulty('Expert');
      setNewGame(true);
    }else if(e.target.textContent === 'High Scores') {
      setShowHighScores(showHighScores => !showHighScores);
    }
  }

  const handleHelpMenu = e => {
    setShowHelp(showHelp => !showHelp);
  }


// Disable squares if gameOver, otherwise disable squares if menu is showing
  useEffect(() => {
    gameOver
      ? setIsDisabled(true)
      : showMenu || showHelp
        ? setIsDisabled(true)
        : setIsDisabled(false);
       
  }, [showMenu, showHelp, gameOver]);


// End Game
  function endGame(result) {
    setIntervalID('');
    const timerID = setTimeout(() => {
      setGameOver(result);
    }, 1000); 
    setTimeoutID(timerID);
  }

// Clear Timeout/Interval on unmount
  useEffect(() => {
    return () => {
      clearTimeout(timeoutID);
    }
  }, [timeoutID]);

  useEffect(() => {
    return () => {
      clearInterval(intervalID);
    }
  }, [intervalID]);

  

  return (
    <>
      <header className='page_header'>
        <img src={bomb} alt='a bomb with a lit fuse'/>
        <h1>Bomb Seeker</h1>
        <img src={bomb} alt='a bomb with a lit fuse'/>
      </header>
      <div className='game_container'>
        <MenuHeader
         openMenu={openMenu} showMenu={showMenu} controlMenu={controlMenu}
         handleHelpMenu={handleHelpMenu} showHelp={showHelp} />
        <GameGrid handleClick={handleClick} handleRightClick={handleRightClick} buttonArray={buttonArray} gameDifficulty={gameDifficulty}/>
        <Counters mines={mines} numSeconds={numSeconds} />
        {gameOver &&
          <EndGameModal result={gameOver} setGameOver={setGameOver} numSeconds={numSeconds} setTotalSquares={setTotalSquares} 
              setNewGame={setNewGame} setIsDisabled={setIsDisabled} gameDifficulty={gameDifficulty} />
        }
        {showHighScores &&
          <HighScoresModal closeHighScores={closeHighScores}/>
        }
      </div>
    </>
  );
}

export default App;
