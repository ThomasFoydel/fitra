import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import React, { useContext, useState } from 'react'
import { useSpring, animated, config } from 'react-spring'
import hamburger from 'imgs/icons/hamburger.svg'
import { CTX } from 'context/Store'

const MobileNavBar = ({
  props: { isLoggedIn, openLogin, trainerExt, logout, isTrainer, currentPage },
}) => {
  const [{ user }] = useContext(CTX)
  const [sideBarOpen, setSideBarOpen] = useState(false)

  const sideBarAnimation = useSpring({ config: config.smooth, left: sideBarOpen ? 0 : -280 })

  return (
    <div>
      <div className="white-border" />
      <animated.div
        style={sideBarAnimation}
        className="mobile-sidebar"
        onClick={() => setSideBarOpen(false)}
      >
        {!isTrainer && (
          <Link to="/trainers" className={`link ${currentPage === 'trainers' && 'current-nav'}`}>
            Trainers
          </Link>
        )}
        {!isLoggedIn && (
          <>
            <button onClick={openLogin} className="link login-btn">
              Login
            </button>
          </>
        )}
        {isLoggedIn && (
          <>
            {isTrainer && (
              <Link
                to={`${trainerExt}/schedule`}
                className={`link ${currentPage === 'schedule' && 'current-nav'}`}
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
              to={`/${isTrainer ? 'trainer' : 'user'}/${user.id}`}
              className={`link ${currentPage === 'ownprofile' && 'current-nav'}`}
            >
              Profile
            </Link>
            <Link
              to={`${trainerExt}/settings`}
              className={`link ${currentPage === 'settings' && 'current-nav'}`}
            >
              Settings
            </Link>
            <button className="logout-btn" onClick={logout}>
              <div className="link">Logout</div>
            </button>
          </>
        )}
      </animated.div>
      <div className="mobile-navbar">
        <Link
          className="home-link"
          onClick={() => setSideBarOpen(false)}
          to={isLoggedIn ? `${trainerExt}/` : '/'}
        >
          <h2 className="logo-title">FITRA</h2>
        </Link>
        <img
          src={hamburger}
          className="open-btn"
          alt="open navigation"
          onClick={() => setSideBarOpen((o) => !o)}
        />
      </div>
    </div>
  )
}

export default MobileNavBar

MobileNavBar.propTypes = {
  props: PropTypes.shape({
    logout: PropTypes.func.isRequired,
    openLogin: PropTypes.func.isRequired,
    isTrainer: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    trainerExt: PropTypes.string.isRequired,
    currentPage: PropTypes.string.isRequired,
  }),
}
