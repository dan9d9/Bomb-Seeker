import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import { API, graphqlOperation } from 'aws-amplify';
import { createScores } from '../graphql/mutations';

const EndGameModal = props => {
	const [ message, setMessage ] = useState();
	const [ submitTime, setSubmitTime ] = useState(false);
	const [ submittedScore, setSubmittedScore ] = useState('');
  	const [ scoreForm, setScoreForm ] = useState({
  		name: '',
	  	country: null,
	  	difficulty: props.gameDifficulty,
	  	score: props.numSeconds
  	});

	useEffect(() => {
		if(props.result === 'win') {
			setMessage(`You found all the bombs in ${props.numSeconds} seconds!`);
		}else if(props.result === 'lose'){
			setMessage('You stepped on a bomb! Next time step around it.');
		}else if(props.result === 'again') {
			submittedScore
			? setMessage('Your score has been submitted!')
			: setMessage('');
		}
	}, [props.result, props.numSeconds, submittedScore]);


	const handleClick = e => {
		if(e.target.textContent === 'Yes') {
			if(props.result === 'win') {
				setSubmitTime(true);	
			}else {
				props.setTotalSquares(0);
				props.setNewGame(true);	
				props.setGameOver('');	
			}	
		}else {
			document.querySelector('.modal_container').style.display = 'none';
		}
	}

	const submitScore = e => {
		e.preventDefault();
		async function addScore() {
		    try {
		      const score = { ...scoreForm }
		      let newScore = await API.graphql(graphqlOperation(createScores, {input: score}));
		      setSubmittedScore(newScore.data.createScores.score);
		      props.getScores();
		    } catch (err) {
		      console.log('error creating score:', err);
		    }
		  }
		  addScore();
	}

	const handleChange = e => {
		setScoreForm({
			...scoreForm,
			[e.target.name]: e.target.value,
		});
	}

	useEffect(() => {
		if(submittedScore) {
			playAgain();
		}
	}, [submittedScore]);

	function playAgain() {
		props.setGameOver('again');
		setSubmitTime(false);
	}

	return (
		<div className='modal_container'>
			{!submitTime
				? <div className='end_game_modal'>
					<div>
						<p>{message}</p>
						<p>{props.result === 'lose' || props.result === 'again' ? 'Play Again?' : 'Submit Time?'}</p>
					</div>
					<div>
						<button onClick={handleClick}>Yes</button>
						<button onClick={handleClick}>No</button>
					</div>
				  </div>
				: <div className='end_game_modal end_game_submit_score'>
					<h2>Your Time: {props.numSeconds}s</h2>
					<form onChange={handleChange} onSubmit={submitScore}>
						<div>
							<label htmlFor='highscore-name'>Name:</label>
							<input id='highscore-name' type='text' name='name' required={true}/>
						</div>
						<div>
							<label htmlFor='highscore-country'>Country:</label>
							<input id='highscore-country' type='text' name='country' />
						</div>
						<div>
							<button type='submit'>Submit</button>
							<button type='button' onClick={playAgain}>Cancel</button>
						</div>
					</form>
				  </div>
			}
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
  setGameOver: PropTypes.func.isRequired,
  gameDifficulty: PropTypes.string.isRequired
}