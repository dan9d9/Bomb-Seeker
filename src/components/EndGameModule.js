import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../App.css';

const EndGameModule = props => {
	const [ message, setMessage ] = useState();

	useEffect(() => {
		if(props.result === 'win') {
			setMessage(`You mopped all the bombs in ${props.numSeconds} seconds!`);
		}else if(props.result === 'lose'){
			setMessage('In Bomb Mopper, bombs mop YOU!');
		}
	}, [props.result, props.numSeconds]);


	const handleClick = e => {
		if(e.target.tagName !== 'BUTTON') {return}
		if(e.target.textContent === 'Yes') {
			props.setTotalSquares(0);
			props.setNewGame(true);	
			props.setGameOver('');
		}else {
			document.querySelector('.module_container').style.display = 'none';
		}
	}

	return (
		<div className='module_container'>
			<div className='end_game_module'>
				<div>
					<p>{message}</p>
					<p>Play Again?</p>
				</div>
				<div onClick={handleClick}>
					<button>Yes</button>
					<button>No</button>
				</div>
			</div>
		</div>
	);
}

export default EndGameModule;

EndGameModule.propTypes = {
  result: PropTypes.string.isRequired,
  numSeconds: PropTypes.number.isRequired,
  setTotalSquares: PropTypes.func.isRequired,
  setNewGame: PropTypes.func.isRequired,
  setIsDisabled: PropTypes.func.isRequired,
  setGameOver: PropTypes.func.isRequired
}