import React from 'react';
import PropTypes from 'prop-types';
import HelpMenuModal from './HelpMenuModal';
import '../App.css';

const MenuHeader = props => {
	return (
		<header className='controls'>
          <div className='new_game_container'>
            <button onClick={props.openMenu} aria-expanded={props.showMenu} aria-controls='new_game_menu'>Menu</button>
            {props.showMenu &&
              <ul id='new_game_menu'>
                <li><button onClick={props.controlMenu}>Beginner</button></li>
                <li><button onClick={props.controlMenu}>Intermediate</button></li>
                <li><button onClick={props.controlMenu}>Expert</button></li>
                <li><button onClick={props.controlMenu}>High Scores</button></li>
              </ul>
            }
          </div>
          <button onClick={props.handleHelpMenu} aria-controls='helpMenu' aria-expanded={props.showHelp}>How To Play</button>
          {props.showHelp &&
            <HelpMenuModal handleHelpMenu={props.handleHelpMenu}/>
          }
        </header>
	)
}

export default MenuHeader;

MenuHeader.propTypes = {
	openMenu: PropTypes.func.isRequired,
	showMenu: PropTypes.bool.isRequired,
	controlMenu: PropTypes.func.isRequired,
	handleHelpMenu: PropTypes.func.isRequired,
	showHelp: PropTypes.bool.isRequired,
}