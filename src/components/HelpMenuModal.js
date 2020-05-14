import React from 'react';
import PropTypes from 'prop-types';
import '../App.css';

const HelpMenuModal = props => {
	return (
		<div id='helpMenu' className='modal_container help_menu_modal'>
			<div className='help_menu'>
				<button type="button" className="close_help" aria-label="Close" onClick={props.handleHelpMenu}>
			      <span>&times;</span>
			    </button>
				<div>
					<h1>Objective</h1>
					<p>Uncover all of the tiles that don't contain a bomb.</p>
				</div>
				<div>
					<h2>How?</h2>
					<p>Click on any tile to begin. Under the tile will be blank or contain a number.
					 The number indicates how many bombs are touching that tile.
					</p>
					<p>Uncover every tile that isn't a bomb to win.</p>
					<p>Right-clicking a tile will place a '!' on a tile that you suspect has a bomb underneath. Right-clicking
					again will remove the '!'.</p>
					<h2>And if I click on a bomb?</h2>
					<p>You die.</p>
				</div>
			</div>
		</div>
	);
}

export default HelpMenuModal;

HelpMenuModal.propTypes = {
	handleHelpMenu: PropTypes.func.isRequired,
}