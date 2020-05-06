import React, { useState, useEffect } from 'react';
import './App.css';
import Button from './components/Button.js';

function App() { 
  const [ boardWidth, setBoardWidth ] = useState(9);
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

  const getSurrounding = (idx) => {
      if(idx === 0) {
        return [1, boardWidth, boardWidth + 1];

      }else if(idx === (boardWidth - 1)) {
        return [idx - 1, idx + boardWidth, (idx + boardWidth) - 1];

      }else if(idx === (totalSquares - boardWidth)) {
        return [idx + 1, idx - boardWidth, (idx - boardWidth) + 1];

      }else if(idx === (totalSquares - 1)) {
        return [(idx - boardWidth) - 1, idx - boardWidth, idx - 1];

      }else if(idx % boardWidth === 0) {
        return [idx - boardWidth, (idx - boardWidth) + 1, idx + 1, idx + boardWidth, (idx + boardWidth) + 1];

      }else if((idx + 1) % boardWidth === 0) {
        return [(idx - boardWidth) - 1, idx - boardWidth, idx - 1, (idx + boardWidth) - 1, idx + boardWidth];

      }else if((idx > 0 && idx < (boardWidth - 1))) {
        return [idx - 1, idx + 1, (idx + boardWidth) - 1, idx + boardWidth, (idx + boardWidth) + 1];

      }else if((idx > (totalSquares - boardWidth) && idx < (totalSquares - 1))) {
        return [(idx - boardWidth) - 1, idx - boardWidth, (idx - boardWidth) + 1, idx - 1, idx + 1];

      }else {
        return [(idx - boardWidth) - 1, idx - boardWidth, (idx - boardWidth) + 1,
                idx - 1, idx + 1,
                (idx + boardWidth) - 1, idx + boardWidth, (idx + boardWidth) + 1];
      }
  }


  const getNeighbors = (idx) => {
    return [idx - boardWidth, idx - 1, idx + 1, idx + boardWidth];
  }

  const markSurrounding = (array, mineIdx) => {
    const surrounding = getSurrounding(mineIdx);

    surrounding.forEach(square => {
      if(square >= 0 && square < totalSquares && array[square].mineNumber !== 'M') {
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
  }

  const clearSquares = (clickedIdx) => {
    console.log('clicked idx', clickedIdx);
    let surrounding = getSurrounding(clickedIdx);
    let tempArray = [...buttonArray];
    let squaresToClear = [];
    console.log('surrounding array of clicked', surrounding);

// Show starting square
    tempArray[clickedIdx].mineNumber = '';
    tempArray[clickedIdx].show = true;

// Show squares surrounding starting square
    surrounding.forEach(squareIdx => {
      console.log('square idx', squareIdx);
      tempArray[squareIdx].show = true
// If surrounding squares mineNumber is 0, set mineNumber to empty and push it into the array of
// remaining squares to clear      
      if(tempArray[squareIdx].mineNumber === 0) {
        tempArray[squareIdx].mineNumber = '';
        squaresToClear.push(squareIdx);
      }
    });

// Function for pulling squares out of squaresToClear array one at a time and clearing the neighbors of said square.
// If neighbor mineNumber is 0, push to the end of the array. Function finishes when squaresToClear array is emptied,
// meaning there are no more connected neighbors with mineNumber === 0,
    const clearNeighbors = () => {
      let toClear = Number(squaresToClear.splice(0, 1));
      let newNeighbors = getSurrounding(toClear);
      console.log('toclear: ', toClear, 'new neighbors: ', newNeighbors);

      newNeighbors.forEach(newSquareIdx => {
        if(newSquareIdx > 0 && newSquareIdx <= totalSquares && !tempArray[newSquareIdx].show && !tempArray[newSquareIdx].isMine) {
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
      setFirstClick(false);
      placeMines(clickedIdx);
      clearSquares(clickedIdx);
    }

    if(buttonArray[clickedIdx].isMine) {
      gameOver();
    }
  }


  return (
    <div className={`appContainer col-${boardWidth}`} onClick={handleClick}>
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
