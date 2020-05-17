import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import Button from './Button';

const GameGrid = props => {
	return (
        <div className={`grid_container col-${props.gameDifficulty}`} onClick={props.handleClick} onContextMenu={props.handleRightClick}>
          {
            props.buttonArray.map((ele, idx) => {
              return <div className='btnContainer' key={idx}>
                  	   <Button idx={ele.idx} isMine={ele.isMine} isFlag={ele.isFlag} mineNumber={ele.mineNumber} show={ele.show} />
                     </div>
            })
          }
        </div>
	)
}

export default GameGrid;

GameGrid.propTypes = {
	handleClick: PropTypes.func.isRequired,
	handleRightClick: PropTypes.func.isRequired,
	buttonArray: PropTypes.array.isRequired, 
	gameDifficulty: PropTypes.string.isRequired
}