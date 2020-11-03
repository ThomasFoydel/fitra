import React, { useContext, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { CTX } from 'context/Store';
import hamburger from 'imgs/icons/hamburger.svg';
import { useSpring, animated, config } from 'react-spring';

const MobileNavBar = ({
  props: { isLoggedIn, openLogin, trainerExt, logout, isTrainer },
}) => {
  const [appState, updateState] = useContext(CTX);
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const sideBarAnimation = useSpring({
    left: sideBarOpen ? 0 : -280,
    // top: sideBarOpen ? '5.9rem' : '-100%',
    // opacity: sideBarOpen ? 1 : 0,
    config: config.smooth,
  });

  return (
    <div>
      <div className='white-border'></div>
      <animated.div
        className='mobile-sidebar'
        style={sideBarAnimation}
        onClick={() => setSideBarOpen(false)}
        // style={{ display: sideBarOpen ? 'flex' : 'none' }}
      >
        {!isTrainer && (
          <Link to='/trainers' className='link'>
            Trainers
          </Link>
        )}
        {!isLoggedIn && (
          <>
            <button onClick={openLogin} className='link login-btn'>
              Login
            </button>
          </>
        )}
        {isLoggedIn && (
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
            <button className='logout-btn' onClick={logout}>
              <div className='link'>Logout</div>
            </button>
          </>
        )}
      </animated.div>
      <div className='mobile-navbar1'>
        <Link
          to={isLoggedIn ? `${trainerExt}/` : '/'}
          className='home-link'
          onClick={() => setSideBarOpen(false)}
        >
          <h2 className='logo-title'>FITRA</h2>
        </Link>
        <img
          src={hamburger}
          onClick={() => setSideBarOpen((o) => !o)}
          className='open-btn'
        />
      </div>
    </div>
  );
};

export default MobileNavBar;
