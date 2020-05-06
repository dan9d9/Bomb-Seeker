import React, { useState, useEffect } from 'react';
import './App.css';
import Button from './components/Button.js';

function App() { 
  const [ boardSize, setBoardSize ] = useState(16);
  const [ buttonArray, setButtonArray ] = useState([]);
  const [ mines, setMines ] = useState(10);
  const [ firstClick, setFirstClick ] = useState(true);

  useEffect(() => {
    let tempArray = [];
    for(let i=0;i<(boardSize * boardSize);i++) {
      tempArray.push({
        idx: i,
        isMine: false,
        isFlag: false,
        mineNumber: 0
      });
    }
    setButtonArray([...tempArray]);

    if(boardSize === 16) {
      setMines(40);
    }
  }, [boardSize]);

  const getNeighbors = (idx) => {
    return [idx - 10, idx - 9, idx - 8, idx - 1, 
    idx + 1, idx + 8, idx + 9, idx + 10];
  }

  const markNeighbors = (array, mineIdx) => {
    const neighbors = getNeighbors(mineIdx);

    neighbors.forEach(square => {
      if(square >= 0 && square < array.length && array[square].mineNumber !== 'M') {
        array[square].mineNumber++;
      }
    });

    return array;
  }
 
  const placeMines = (clickedIdx) => {
    let totalMines = mines;
    let tempArray = [...buttonArray];
    let minesArray = [];
    let startNeighbors = getNeighbors(clickedIdx);

    while(totalMines > 0) {
      let newMine = Math.floor(Math.random() * Math.max(boardSize * boardSize));
      if(newMine !== clickedIdx && !startNeighbors.includes(newMine) && !minesArray.includes(newMine)) {
        minesArray.push(newMine);
        tempArray[newMine].isMine = true;
        tempArray[newMine].mineNumber = 'M';
        tempArray = markNeighbors(tempArray, newMine);
        totalMines--;
      }
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
    }

    if(buttonArray[clickedIdx].isMine) {
      gameOver();
    }
  }


  return (
    <div className={`appContainer col-${boardSize}`} onClick={handleClick}>
      {
        buttonArray.map((ele, idx) => {
        return <div className='btnContainer' key={idx}>
                <Button idx={ele.idx} isMine={ele.isMine} isFlag={ele.isFlag} mineNumber={ele.mineNumber} />
               </div>
        })
      }
    </div>
  );
}

export default App;
