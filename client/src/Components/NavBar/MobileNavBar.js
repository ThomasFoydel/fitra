import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSpring, animated, config } from 'react-spring';
import PropTypes from 'prop-types';
import hamburger from 'imgs/icons/hamburger.svg';
import { CTX } from 'context/Store';

const MobileNavBar = ({
  props: { isLoggedIn, openLogin, trainerExt, logout, isTrainer, currentPage },
}) => {
  const [appState] = useContext(CTX);
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const sideBarAnimation = useSpring({
    left: sideBarOpen ? 0 : -280,
    config: config.smooth,
  });

  return (
    <div>
      <div className='white-border'></div>
      <animated.div
        className='mobile-sidebar'
        style={sideBarAnimation}
        onClick={() => setSideBarOpen(false)}
      >
        {!isTrainer && (
          <Link
            to='/trainers'
            className={`link ${currentPage === 'trainers' && 'current-nav'}`}
          >
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
      </animated.div>
      <div className='mobile-navbar'>
        <Link
          to={isLoggedIn ? `${trainerExt}/` : '/'}
          className='home-link'
          onClick={() => setSideBarOpen(false)}
        >
          <h2 className='logo-title'>FITRA</h2>
        </Link>
        <img
          alt='open navigation'
          src={hamburger}
          onClick={() => setSideBarOpen((o) => !o)}
          className='open-btn'
        />
      </div>
    </div>
  );
};

export default MobileNavBar;

MobileNavBar.propTypes = {
  props: PropTypes.shape({
    isLoggedIn: PropTypes.bool.isRequired,
    openLogin: PropTypes.func.isRequired,
    trainerExt: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired,
    isTrainer: PropTypes.bool.isRequired,
    currentPage: PropTypes.string.isRequired,
  }),
};
