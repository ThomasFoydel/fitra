import React, { useContext, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

import './NavBar.scss';
import { CTX } from 'context/Store';
import MobileNavBar from './MobileNavBar';
import { useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();
  console.log(location.pathname);
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

  const openLogin = () => {
    updateState({
      type: 'CHANGE_AUTH_TYPE',
      payload: { type: 'client' },
    });
    updateState({
      type: 'CHANGE_AUTH_PAGE',
      payload: { page: 'login' },
    });
    updateState({ type: 'TOGGLE_AUTH' });
  };

  return (
    <>
      {redirect && <Redirect to='/' />}
      <div className='navbar'>
        <Link to={isLoggedIn ? `${trainerExt}/` : '/'} className='home-link'>
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
            {isTrainer && (
              <Link to={`${trainerExt}/schedule`} className='link'>
                Schedule
              </Link>
            )}
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
            <button className='logout-btn' onClick={logout}>
              <div className='link'>Logout</div>
            </button>
          </>
        )}

        {!isLoggedIn && (
          <button onClick={openLogin} className='link login-btn'>
            Login
          </button>
        )}
      </div>
      <MobileNavBar
        props={{ isLoggedIn, openLogin, isTrainer, trainerExt, logout }}
      />
      <div style={{ height: '6rem' }} />
    </>
  );
};

export default NavBar;

// var parseLocation = (loc)=>{
//   if (loc.substring())
// }
