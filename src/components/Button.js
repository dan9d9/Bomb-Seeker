import React from 'react';
import '../App.css';

const Button = props => {
	
	return (
		<div data-name='btn' data-idx={props.idx} className={`button ${props.show ? 'show_btn' : 'hide_btn'}`}>
			{props.show
				? props.mineNumber
				: props.isFlag
					? '?'
					: null
			}
		</div>
	);
}

export default Button;