import React, { useContext } from 'react';
import { Link } from 'react-router-dom';

import './NavBar.scss';
import { CTX } from 'context/Store';

const NavBar = () => {
  const [appState, updateState] = useContext(CTX);
  const { isLoggedIn, user } = appState;

  const isTrainer = user.type === 'trainer';
  const trainerExt = isTrainer ? '/coachportal' : '';

  return (
    <div className='navbar'>
      <Link to={`${trainerExt}/home`} className='link'>
        Home
      </Link>
      <Link to={`${trainerExt}/schedule`} className='link'>
        Schedule
      </Link>

      {!isTrainer && (
        <Link to='/trainers' className='link'>
          Trainers
        </Link>
      )}
      {/* {isTrainer && ( */}
      <Link to={`${trainerExt}/editprofile`} className='link'>
        Edit Profile
      </Link>
      {/* )} */}

      {isLoggedIn && (
        <>
          <Link to={`${trainerExt}/messages`} className='link'>
            Messages
          </Link>
          <Link to={`${trainerExt}/settings`} className='link'>
            Settings
          </Link>
          <button
            className='link'
            onClick={() => updateState({ type: 'LOGOUT' })}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default NavBar;