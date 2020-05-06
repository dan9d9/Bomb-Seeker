import React, {useState} from 'react';
import '../App.css';

const Button = props => {
	
	return (
		<div data-name='btn' data-idx={props.idx} className='button'>
			{props.show
				? props.mineNumber
				: '?'
			}
		</div>
	);
}

export default Button;