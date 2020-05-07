import React, { useState, useEffect } from 'react';
import './App.css';
import Button from './components/Button.js';

function App() { 
  const [ gameDifficulty, setGameDifficulty ] = useState('Beginner');
  const [ boardWidth, setBoardWidth ] = useState();
  const [ totalSquares, setTotalSquares ] = useState();
  const [ buttonArray, setButtonArray ] = useState([]);
  const [ startingMines, setStartingMines ] = useState();
  const [ mines, setMines ] = useState();
  const [ renderGrid, setRenderGrid ] = useState();
  const [ firstClick, setFirstClick ] = useState(true);
  const [ numSeconds, setNumSeconds ] = useState(0);
  const [ intervalID, setIntervalID ] = useState('');
  const [ uncoveredSquares, setUncoveredSquares ] = useState(0);
  const [ isDisabled, setIsDisabled ] = useState(false);

  function setBeginnerBoard() {
    setBoardWidth(9);
    setTotalSquares(9 * 9);
    setStartingMines(10);
    setMines(10);
    setRenderGrid(true);
  }

  function setIntermediateBoard() {
    setBoardWidth(16);
    setTotalSquares(16 * 16);
    setStartingMines(40);
    setMines(40);
    setRenderGrid(true);
  }

  function setExpertBoard() {
    setBoardWidth(30);
    setTotalSquares(30 * 16);
    setStartingMines(99);
    setMines(99);
    setRenderGrid(true);
  }

  useEffect(() => {
    setBeginnerBoard();
  }, []);

  useEffect(() => {
    if(renderGrid) {

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
      setRenderGrid(false);
      setButtonArray([...tempArray]);
    }
    
  }, [renderGrid, totalSquares]);

  useEffect(() => {
    let tempSquares = buttonArray.filter(btn => btn.show === true);
    setUncoveredSquares(tempSquares.length);
  }, [mines, buttonArray]);

  useEffect(() => {
    return totalSquares - uncoveredSquares === startingMines
      ? youWin()
      : undefined
  }, [uncoveredSquares]);

  const getSurrounding = (idx) => {
    // top-left corner
      if(idx === 0) {
        return [1, boardWidth, boardWidth + 1];
    // top-right corner
      }else if(idx === (boardWidth - 1)) {
        return [idx - 1, idx + boardWidth, (idx + boardWidth) - 1];
    // bottom-left corner
      }else if(idx === (totalSquares - boardWidth)) {
        return [idx + 1, idx - boardWidth, (idx - boardWidth) + 1];
    // bottom-right corner
      }else if(idx === (totalSquares - 1)) {
        return [(idx - boardWidth) - 1, idx - boardWidth, idx - 1];
    // in first column    
      }else if(idx % boardWidth === 0) {
        return [idx - boardWidth, (idx - boardWidth) + 1, idx + 1, idx + boardWidth, (idx + boardWidth) + 1]
    // in last column
      }else if((idx + 1) % boardWidth === 0) {
        return [(idx - boardWidth) - 1, idx - boardWidth, idx - 1, (idx + boardWidth) - 1, idx + boardWidth]
    // in first row
      }else if((idx > 0 && idx < (boardWidth - 1))) {
        return [idx - 1, idx + 1, (idx + boardWidth) - 1, idx + boardWidth, (idx + boardWidth) + 1]
    // in last row
      }else if((idx > (totalSquares - boardWidth) && idx < (totalSquares - 1))) {
        return [(idx - boardWidth) - 1, idx - boardWidth, (idx - boardWidth) + 1, idx - 1, idx + 1]
    // not on a border
      }else {
        return [(idx - boardWidth) - 1, idx - boardWidth, (idx - boardWidth) + 1,
                idx - 1, idx + 1,
                (idx + boardWidth) - 1, idx + boardWidth, (idx + boardWidth) + 1]
      }   
    }

  const markSurrounding = (array, mineIdx) => {
    const surrounding = getSurrounding(mineIdx);

    surrounding.forEach(square => {
      if(array[square].mineNumber !== 'M') {
        array[square].mineNumber++;
      }
    });

    return array;
  }
 
  const placeMines = (clickedIdx) => {
    let totalMines = mines;
    let tempArray = [...buttonArray];
    let minesArray = [];
    let startSurrounding = getSurrounding(clickedIdx);

    while(totalMines > 0) {
      let newMine = Math.floor(Math.random() * Math.max(totalSquares));
      if(newMine !== clickedIdx && !startSurrounding.includes(newMine) && !minesArray.includes(newMine)) {
        minesArray.push(newMine);
        tempArray[newMine].isMine = true;
        tempArray[newMine].mineNumber = 'M';
        tempArray = markSurrounding(tempArray, newMine);
        totalMines--;
      }
    }
    setButtonArray([...tempArray]);
    setFirstClick(false);
  }

  const clearSquares = (clickedIdx) => {
    let surrounding = getSurrounding(clickedIdx);
    let tempArray = [...buttonArray];
    let squaresToClear = [];

  // If clicked square does not have a mine in surrounding squares, begin process of clearing neighboring squares
    if(tempArray[clickedIdx].mineNumber === 0) {

      tempArray[clickedIdx].mineNumber = '';

      // Show squares surrounding clicked square
      surrounding.forEach(squareIdx => {
        tempArray[squareIdx].show = true
        // If surrounding squares mineNumber is 0, set mineNumber to empty and push it into the array of
        // remaining squares to clear      
        if(tempArray[squareIdx].mineNumber === 0) {
          tempArray[squareIdx].mineNumber = '';
          squaresToClear.push(squareIdx);
        }
      });
    }
  // Otherwise, if mine is present in surrounding squares, only show clicked square
    tempArray[clickedIdx].show = true;

    // Function for pulling squares out of squaresToClear array one at a time and clearing the neighbors of said square.
    // If neighbor mineNumber is 0, push to the end of the array. Function finishes when squaresToClear array is emptied,
    // meaning there are no more connected neighbors with mineNumber === 0,
    const clearNeighbors = () => {
      let toClear = Number(squaresToClear.splice(0, 1));
      let newNeighbors = getSurrounding(toClear);

      newNeighbors.forEach(newSquareIdx => {
        if(!tempArray[newSquareIdx].show && !tempArray[newSquareIdx].isMine) {
          tempArray[newSquareIdx].show = true;
          if(tempArray[newSquareIdx].mineNumber === 0) {
            tempArray[newSquareIdx].mineNumber = '';
            squaresToClear.push(newSquareIdx);
          }
        }
      }); 
    }

    // Initiate clearNeighbors function
    while(squaresToClear.length > 0) {
      clearNeighbors();
    }

    setButtonArray([...tempArray]);
  }

  const handleClick = e => {
    if(!e.target.dataset.clickable || isDisabled) {return}
    const clickedIdx = Number(e.target.dataset.idx);
    const tempArray = [...buttonArray];

    if(firstClick === true) {
      placeMines(clickedIdx);
      let secondsTimer = setInterval(() => {
        setNumSeconds(numSeconds => numSeconds + 1);
      }, 1000);
      setIntervalID(secondsTimer);
    }
    if(buttonArray[clickedIdx].isMine) {
      tempArray[clickedIdx].show = true;
      setButtonArray([...tempArray]);
      youLose();
    }

    clearSquares(clickedIdx);
  }

  const handleRightClick = e => {
    e.preventDefault();
    if(!e.target.dataset.clickable || isDisabled) {return}

    const clickedIdx = Number(e.target.dataset.idx);
    let tempArray = [...buttonArray];
    let tempMines = mines;

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

  function youLose () {
    clearInterval(intervalID);
    if(window.confirm('In BombMopper, bombs mop YOU!')) {
      setFirstClick(true);
      setNumSeconds(0);
      setUncoveredSquares(0);
      gameDifficulty === 'Beginner'
        ? setBeginnerBoard()
        : gameDifficulty === 'Intermediate'
          ? setIntermediateBoard()
          : setExpertBoard();
    }else {
      setIsDisabled(true);
    }
  }

  function youWin() {
    clearInterval(intervalID);
    if(window.confirm(`You mopped all the bombs in ${numSeconds} seconds!`)) {
      setFirstClick(true);
      setNumSeconds(0);
      setUncoveredSquares(0);
      gameDifficulty === 'Beginner'
        ? setBeginnerBoard()
        : gameDifficulty === 'Intermediate'
          ? setIntermediateBoard()
          : setExpertBoard();
    }else {
      setIsDisabled(true);
    }
  }

  useEffect(() => {
    return () => {
      clearInterval(intervalID);
    }
  }, []);
  

  return (
    <div className='app_container'>
      <div className={`grid_container col-${gameDifficulty}`} onClick={handleClick} onContextMenu={handleRightClick}>
        {
          buttonArray.map((ele, idx) => {
          return <div className='btnContainer' key={idx}>
                  <Button idx={ele.idx} isMine={ele.isMine} isFlag={ele.isFlag} mineNumber={ele.mineNumber} show={ele.show} />
                 </div>
          })
        }
      </div>
      <div className='counter_container'>
        <div className='mine_counter'>{mines}</div>
        <div className='timer'>{numSeconds}</div>
      </div>
    </div>
  );
}

export default App;
