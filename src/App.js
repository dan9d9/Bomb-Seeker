import React, { useState, useEffect } from 'react';
import './App.css';
import Button from './components/Button.js';

function App() { 
  const [ boardWidth, setBoardWidth ] = useState(16);
  const [ buttonArray, setButtonArray ] = useState([]);
  const [ mines, setMines ] = useState(10);
  const [ firstClick, setFirstClick ] = useState(true);

  const totalSquares = boardWidth * boardWidth;

  useEffect(() => {
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

    if(boardWidth === 16) {
      setMines(40);
    }
  }, [boardWidth]);

  const getSurrounding = (idx, isUserClick) => {
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
        return isUserClick
          ? [idx - boardWidth, (idx - boardWidth) + 1, idx + 1, idx + boardWidth, (idx + boardWidth) + 1]
          : [idx - boardWidth, idx + 1, idx + boardWidth];
    // in last column
      }else if((idx + 1) % boardWidth === 0) {
        return isUserClick
          ? [(idx - boardWidth) - 1, idx - boardWidth, idx - 1, (idx + boardWidth) - 1, idx + boardWidth]
          : [idx - boardWidth, idx - 1, idx + boardWidth];
    // in first row
      }else if((idx > 0 && idx < (boardWidth - 1))) {
        return isUserClick
          ? [idx - 1, idx + 1, (idx + boardWidth) - 1, idx + boardWidth, (idx + boardWidth) + 1]
          : [idx - 1, idx + 1, idx + boardWidth];
    // in last row
      }else if((idx > (totalSquares - boardWidth) && idx < (totalSquares - 1))) {
        return isUserClick
          ? [(idx - boardWidth) - 1, idx - boardWidth, (idx - boardWidth) + 1, idx - 1, idx + 1]
          : [idx - boardWidth, idx - 1, idx + 1];
    // not on a border
      }else {
        return isUserClick
          ? [(idx - boardWidth) - 1, idx - boardWidth, (idx - boardWidth) + 1,
                idx - 1, idx + 1,
                (idx + boardWidth) - 1, idx + boardWidth, (idx + boardWidth) + 1]
          : [idx - boardWidth, idx - 1, idx + 1, idx + boardWidth]; 
      }   
    }

  const markSurrounding = (array, mineIdx) => {
    const surrounding = getSurrounding(mineIdx, true);

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
    let startSurrounding = getSurrounding(clickedIdx, true);

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
    let surrounding = getSurrounding(clickedIdx, true);
    let tempArray = [...buttonArray];
    let squaresToClear = [];

    if(tempArray[clickedIdx].mineNumber === 0) {
      // Show starting square
      tempArray[clickedIdx].mineNumber = '';

      // Show squares surrounding starting square
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

    tempArray[clickedIdx].show = true;

    // Function for pulling squares out of squaresToClear array one at a time and clearing the neighbors of said square.
    // If neighbor mineNumber is 0, push to the end of the array. Function finishes when squaresToClear array is emptied,
    // meaning there are no more connected neighbors with mineNumber === 0,
    const clearNeighbors = () => {
      let toClear = Number(squaresToClear.splice(0, 1));
      let newNeighbors = getSurrounding(toClear, false);

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

    while(squaresToClear.length > 0) {
      clearNeighbors();
    }

    setButtonArray([...tempArray]);
  }

  const gameOver = () => {
    alert('Game over man!');
  }

  const handleClick = e => {
    if(e.target.dataset.name !== 'btn') {return}
    const clickedIdx = Number(e.target.dataset.idx);

    if(firstClick === true) {
      placeMines(clickedIdx);
    }
    if(buttonArray[clickedIdx].isMine) {
      gameOver();
    }

    clearSquares(clickedIdx);
  }

  const handleRightClick = e => {
    e.preventDefault();
    if(e.target.dataset.name !== 'btn') {return}

    const clickedIdx = Number(e.target.dataset.idx);
    let tempArray = [...buttonArray];

    tempArray[clickedIdx].isFlag = !tempArray[clickedIdx].isFlag
    setButtonArray([...tempArray]);
  }
  

  return (
    <div className={`appContainer col-${boardWidth}`} onClick={handleClick} onContextMenu={handleRightClick}>
      {
        buttonArray.map((ele, idx) => {
        return <div className='btnContainer' key={idx}>
                <Button idx={ele.idx} isMine={ele.isMine} isFlag={ele.isFlag} mineNumber={ele.mineNumber} show={ele.show} />
               </div>
        })
      }
    </div>
  );
}

export default App;
