import React, { useContext } from 'react'
import { useSpring, animated, config } from 'react-spring'
import { CTX } from 'context/Store'
import Register from './Register'
import Login from './Login'
import './Auth.scss'

const Auth = () => {
  const [{ authPage, authType, showAuth }, updateState] = useContext(CTX)

  const trainer = authType === 'trainer'

  const setCurrentShow = (page) => updateState({ type: 'CHANGE_AUTH_PAGE', payload: { page } })

  const setAuthOpen = () => updateState({ type: 'TOGGLE_AUTH' })

  const backgroundAnimation = useSpring({
    config: config.smooth,
    from: { opacity: 0, pointerEvents: 'none' },
    to: { opacity: showAuth ? 1 : 0, pointerEvents: showAuth ? 'auto' : 'none' },
  })

  const modalAnimation = useSpring({
    config: config.smooth,
    from: { transform: 'translateY(-500px)' },
    to: { transform: showAuth ? 'translateY(0px)' : 'translateY(-500px)' },
  })

  return (
    <animated.div style={backgroundAnimation} className="auth" onClick={setAuthOpen}>
      <animated.div style={modalAnimation}>
        {authPage === 'register' ? (
          <Register
            props={{
              trainer,
              setAuthOpen,
              setCurrentShow,
            }}
          />
        ) : (
          <Login
            props={{
              trainer,
              setAuthOpen,
              setCurrentShow,
            }}
          />
        )}
      </animated.div>
    </animated.div>
  )
}

export default Auth
