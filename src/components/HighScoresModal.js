import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import { API, graphqlOperation } from 'aws-amplify';
import { listScoress } from '../graphql/queries';

const HighScoresModal = props => {
	const [ beginnerScores, setBeginnerScores ] = useState([]);
	const [ intermediateScores, setIntermediateScores] = useState([]);
	const [ expertScores, setExpertScores] = useState([]);
	const [ showScores, setShowScores ] = useState([]);
	const [ isLoading, setIsLoading ] = useState(false);

	async function getScores() {
		try {
			setIsLoading(true);
		  	const scoresData = await API.graphql(graphqlOperation(listScoress));
		  	const scores = scoresData.data.listScoress.items;

		  	let tempBeginner = scores.filter(ele => ele.difficulty === 'Beginner').sort((a, b) => a.score - b.score);
		 	let tempIntermediate = scores.filter(ele => ele.difficulty === 'Intermediate').sort((a, b) => a.score - b.score);
			let tempExpert = scores.filter(ele => ele.difficulty === 'Expert').sort((a, b) => a.score - b.score);

		  	setBeginnerScores([...tempBeginner]);
			setIntermediateScores([...tempIntermediate]);
			setExpertScores([...tempExpert]);
			setShowScores([...tempBeginner]);
			setIsLoading(false);
		} catch (err) { 
			setIsLoading(false);
			console.log('error fetching scores', err) }
	}

	useEffect(() => {
		getScores();
	}, []);

	const handleClick = e => {
		const buttons = document.querySelectorAll('.high_score_buttons button');
		buttons.forEach(btn => btn.dataset.clicked = 'false');
		e.target.dataset.clicked = true;

		switch(e.target.textContent) {
			case 'Beginner':
				setShowScores([...beginnerScores]);
				break;
			case 'Intermediate':
				setShowScores([...intermediateScores]);
				break;
			case 'Expert':
				setShowScores([...expertScores]);
				break;
			default:
				setShowScores([...beginnerScores]);
		}
	}

	return (
		<div className='modal_container high_score_modal'>
			<button type="button" className="close_help" aria-label="Close" onClick={props.closeHighScores}>
	      		<span>&times;</span>
	    	</button>
	    	<div>
	    		<h1>High Scores</h1>
				<div className='high_score_buttons'>
					<button data-clicked='true' onClick={handleClick}>Beginner</button>
					<button data-clicked='false' onClick={handleClick}>Intermediate</button>
					<button data-clicked='false' onClick={handleClick}>Expert</button>
				</div>
				<div className="high_scores_list_container">
					{isLoading
						? <h2>Loading scores!</h2>
						: showScores.length !== 0
							? <ol>
								{showScores.map((ele, idx) => {
									return <li key={idx}>
												<p><span>{ele.score}s</span>
												<span>{ele.name}</span>
												<span>{ele.country}</span>
												</p>
											</li>
								
									})
								}
							  </ol>
							: <h2>No scores yet!</h2>
					}
				</div>
			</div>
		</div>
	);
}

export default HighScoresModal;

HighScoresModal.propTypes = {
  closeHighScores: PropTypes.func.isRequired,
}