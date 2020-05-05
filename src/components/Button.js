import React, {useState} from 'react';
import '../App.css';

const Button = props => {
	const [ isMine, setIsMine ] = useState(false);
	const [ isFlag, setIsFlag ] = useState(false);

	const handleClick = e => {
		const clicked = e.target.dataset.idx;
		console.log('first click in btn: ', props.firstClick);
		if(props.firstClick === true) {
	      props.placeMines(clicked);
	    }
	}

	return (
		<div data-name='btn' data-idx={props.idx} onClick={handleClick} className='button'>
			{props.mineNum}
		</div>
	);
}

export default Button;