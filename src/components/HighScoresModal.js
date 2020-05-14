import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../App.css';

const HighScoresModal = props => {
	const [ beginnerScores, setBeginnerScores ] = useState([]);
	const [ intermediateScores, setIntermediateScores] = useState([]);
	const [ expertScores, setExpertScores] = useState([]);
	const [ showScores, setShowScores ] = useState([]);

	useEffect(() => {
		let tempBeginner = props.highScores.filter(ele => ele.difficulty === 'Beginner').sort((a, b) => a.score > b.score);
		let tempIntermediate = props.highScores.filter(ele => ele.difficulty === 'Intermediate').sort((a, b) => a.score > b.score);
		let tempExpert = props.highScores.filter(ele => ele.difficulty === 'Expert').sort((a, b) => a.score > b.score);

		setBeginnerScores([...tempBeginner]);
		setIntermediateScores([...tempIntermediate]);
		setExpertScores([...tempExpert]);
	}, []);

	useEffect(() => {
		setShowScores([...beginnerScores]);
	}, [beginnerScores]);

	useEffect(() => {
		console.log(showScores);
	}, [showScores]);

	const handleClick = e => {
		const buttons = document.querySelectorAll('.high_score_buttons button');
		buttons.forEach(btn => btn.dataset.clicked = 'false');
		e.target.dataset.clicked = true;

		if(e.target.textContent === 'Beginner') {
			setShowScores([...beginnerScores]);
		}else if(e.target.textContent === 'Intermediate') {
			setShowScores([...intermediateScores]);
		}else if(e.target.textContent === 'Expert') {
			setShowScores([...expertScores]);
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
					{showScores.length === 0
						? <h2>No scores yet!</h2>
						: <ol>
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
					}
				</div>
			</div>
		</div>
	);
}

export default HighScoresModal;