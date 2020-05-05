import React, { useState, useEffect } from 'react';
import './App.css';
import Button from './components/Button.js';

function App() { 
  const [ boardSize, setBoardSize ] = useState(9);
  const [ buttonArray, setButtonArray ] = useState([]);
  const [ mines, setMines ] = useState(10);
  const [ firstClick, setFirstClick ] = useState(null);

  useEffect(() => {
    setFirstClick(true);
    let tempArray = [];
    for(let i=0;i<(boardSize * boardSize);i++) {
      tempArray.push(<Button idx={i} firstClick={firstClick} setFirstClick={setFirstClick} placeMines={placeMines} />);
    }
    setButtonArray([...tempArray]);

    if(boardSize === 16) {
      setMines(40);
    }
  }, [boardSize]);

  useEffect(() => {
    console.log('btnArray: ', buttonArray);
  }, [buttonArray]);

  useEffect(() => {
    console.log('first click is ', firstClick);
  }, [firstClick]);
 

  const placeMines = (clicked) => {
    setFirstClick(false);
    console.log('first click!', clicked);
    let totalMines = mines;
    console.log('button array', buttonArray);
    let tempArray = [...buttonArray];
    console.log('tempArray', tempArray)
    while(totalMines > 0) {
      let newMine = Math.floor(Math.random() * Math.max(boardSize * boardSize));
      if(newMine !== clicked) {
        console.log(newMine);
        totalMines--;
      }
    }
  }

  return (
    <div className={`appContainer col-${boardSize}`}>
      {
        buttonArray.map((ele, idx) => {
        return <div className='btnContainer' key={idx}>
                {ele}
               </div>
        })
      }
    </div>
  );
}

export default App;
