import React from 'react';
import '../App.css';

const Button = props => {
	
	return (
		<div data-clickable={true} data-idx={props.idx} className={`button ${props.show ? 'show_btn' : 'hide_btn'}`}>
			{props.show
				? props.mineNumber
				: props.isFlag
					? <p data-clickable={true} data-idx={props.idx}>?</p>
					: null
			}
		</div>
	);
}

export default Button;