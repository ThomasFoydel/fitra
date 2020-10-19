import React, { useContext, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

import './NavBar.scss';
import { CTX } from 'context/Store';

const NavBar = ({ setAuthOpen }) => {
  const [appState, updateState] = useContext(CTX);
  const { isLoggedIn, user } = appState;
  const [redirect, setRedirect] = useState(false);

  const isTrainer = user.type === 'trainer';
  const trainerExt = isTrainer ? '/coachportal' : '';

  const logout = () => {
    updateState({ type: 'LOGOUT' });
    setTimeout(() => {
      setRedirect(true);
    }, 700);
  };

  return (
    <>
      {redirect && <Redirect to='/' />}
      <div className='navbar'>
        <Link
          to={isLoggedIn ? `${trainerExt}/home` : '/'}
          className='home-link'
        >
          <h2 className='logo-title'>FITRA</h2>
        </Link>

        {!isTrainer && (
          <Link to='/trainers' className='link'>
            Trainers
          </Link>
        )}

        {/* <Link to={`${trainerExt}/editprofile`} className='link'>
          Edit Profile
        </Link> */}
        {isLoggedIn && (
          <>
            <Link to={`${trainerExt}/schedule`} className='link'>
              Schedule
            </Link>
            <Link
              to={`/${isTrainer ? 'trainer' : 'user'}/${appState.user.id}`}
              className='link'
            >
              Profile
            </Link>
            <Link to={`${trainerExt}/messages`} className='link'>
              Messages
            </Link>
            <Link to={`${trainerExt}/settings`} className='link'>
              Settings
            </Link>
            <button className='logout-btn' onClick={logout}>
              <div className='link'>Logout</div>
            </button>
          </>
        )}

        {!isLoggedIn && (
          <button onClick={() => setAuthOpen(true)} className='link login-btn'>
            Login | Register
          </button>
        )}
      </div>
      <div style={{ height: '6rem' }} />
    </>
  );
};

export default NavBar;
