import React, { useContext, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { CTX } from 'context/Store';

const MobileNavBar = ({
  props: { isLoggedIn, openLogin, trainerExt, logout, isTrainer },
}) => {
  const [appState, updateState] = useContext(CTX);

  return (
    <div className='mobile-navbar'>
      <Link to={isLoggedIn ? `${trainerExt}/` : '/'} className='home-link'>
        <h2 className='logo-title'>FITRA</h2>
      </Link>
      MOBILENAVBAR
      {!isTrainer && (
        <Link to='/trainers' className='link'>
          Trainers
        </Link>
      )}
      {!isLoggedIn && (
        <>
          <Link to={`${trainerExt}/schedule`} className='link'>
            Schedule
          </Link>
          <Link to={`${trainerExt}/messages`} className='link'>
            Messages
          </Link>
          <Link
            to={`/${isTrainer ? 'trainer' : 'user'}/${appState.user.id}`}
            className='link'
          >
            Profile
          </Link>
          <Link to={`${trainerExt}/settings`} className='link'>
            Settings
          </Link>

          <button onClick={openLogin} className='link login-btn'>
            Login
          </button>
        </>
      )}
    </div>
  );
};

export default MobileNavBar;
