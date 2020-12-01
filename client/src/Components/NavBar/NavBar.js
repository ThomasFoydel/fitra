import React, { useContext, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';

import './NavBar.scss';
import { CTX } from 'context/Store';
import MobileNavBar from './MobileNavBar';
import { useLocation } from 'react-router-dom';

const NavBar = () => {
  const location = useLocation();
  const [appState, updateState] = useContext(CTX);
  const { isLoggedIn, user } = appState;
  const currentPage = parsePage(location.pathname, appState.user || {});
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
        <Link
          to={isLoggedIn ? `${trainerExt}/` : '/'}
          className={`home-link ${currentPage === 'home' && 'current-nav'}`}
        >
          <h2 className='logo-title'>FITRA</h2>
        </Link>

        {!isTrainer && (
          <Link
            to='/trainers'
            className={`link ${currentPage === 'trainers' && 'current-nav'}`}
          >
            Trainers
          </Link>
        )}

        {isLoggedIn && (
          <>
            {isTrainer && (
              <Link
                to={`${trainerExt}/schedule`}
                className={`link ${
                  currentPage === 'schedule' && 'current-nav'
                }`}
              >
                Schedule
              </Link>
            )}
            <Link
              to={`${trainerExt}/messages`}
              className={`link ${currentPage === 'messages' && 'current-nav'}`}
            >
              Messages
            </Link>
            <Link
              to={`/${isTrainer ? 'trainer' : 'user'}/${appState.user.id}`}
              className={`link ${
                currentPage === 'ownprofile' && 'current-nav'
              }`}
            >
              Profile
            </Link>
            <Link
              to={`${trainerExt}/settings`}
              className={`link ${currentPage === 'settings' && 'current-nav'}`}
            >
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
        props={{
          isLoggedIn,
          openLogin,
          isTrainer,
          trainerExt,
          logout,
          currentPage,
        }}
      />
      <div style={{ height: '6rem' }} />
    </>
  );
};

export default NavBar;

var parsePage = (string, user) => {
  if (string.substring(0, 12) === '/coachportal') string = string.slice(12);
  if (string === `/${user.type}/${user.id}`) return 'ownprofile';
  else if (string === '/') return 'home';
  else if (string.substring(0, 9) === '/trainer/') return 'trainer';
  else if (string.substring(0, 6) === '/user/') return 'user';
  else return string.substring(1, string.length);
};

/* 
pages: 
/settings
/trainer/:id
/user/:id
/editprofile
/messages
/schedule
/trainers
/
/terms-of-use
*/
