import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';

const Counters = props => {
	return (
		<div className='counter_container'>
          <div className='mine_counter'>{props.mines}</div>
          <div className='timer'>{props.numSeconds}</div>
        </div>
	)
}

export default Counters;

Counters.propTypes = {
	mines: PropTypes.number.isRequired,
	numSeconds: PropTypes.number.isRequired
}