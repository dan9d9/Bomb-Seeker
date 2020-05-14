import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../App.css';

const EndGameModal = props => {
	const [ message, setMessage ] = useState();

	useEffect(() => {
		if(props.result === 'win') {
			props.setScoreForm({name: '', score: props.numSeconds, difficulty: props.gameDifficulty, country: ''});
			setMessage(`You found all the bombs in ${props.numSeconds} seconds!`);
		}else if(props.result === 'lose'){
			setMessage('You stepped on a bomb! Next time step around it.');
		}
	}, [props.result, props.numSeconds]);


	const handleClick = e => {
		if(e.target.textContent === 'Yes') {
			props.addScore();
			props.setTotalSquares(0);
			props.setNewGame(true);	
			props.setGameOver('');
		}else {
			document.querySelector('.modal_container').style.display = 'none';
		}
	}

	return (
		<div className='modal_container'>
			<div className='end_game_modal'>
				<div>
					<p>{message}</p>
					<p>Play Again?</p>
				</div>
				<div>
					<button onClick={handleClick}>Yes</button>
					<button onClick={handleClick}>No</button>
				</div>
			</div>
		</div>
	);
}

export default EndGameModal;

EndGameModal.propTypes = {
  result: PropTypes.string.isRequired,
  numSeconds: PropTypes.number.isRequired,
  setTotalSquares: PropTypes.func.isRequired,
  setNewGame: PropTypes.func.isRequired,
  setIsDisabled: PropTypes.func.isRequired,
  setGameOver: PropTypes.func.isRequired
}