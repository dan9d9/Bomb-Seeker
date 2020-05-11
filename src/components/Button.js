import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';
import bomb from '../bomb.png';

const Button = props => {
	
	return (
		<div data-clickable={true} data-idx={props.idx} className={`button ${props.show ? 'show_btn' : 'hide_btn'}`}>
			{props.show
				? <img src={props.mineNumber === 'M' ? bomb : ''} alt={props.mineNumber} />
				: props.isFlag
					? <p data-clickable={true} data-idx={props.idx}>!</p>
					: null
			}
		</div>
	);
}

export default Button;

Button.propTypes = {
  idx: PropTypes.number.isRequired,
  mineNumber: PropTypes.oneOfType([
  	PropTypes.string,
  	PropTypes.number
  ]).isRequired,
  show: PropTypes.bool.isRequired,
  isFlag: PropTypes.bool.isRequired
}