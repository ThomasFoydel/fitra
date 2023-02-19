import React, { useContext } from 'react'
import { useSpring, animated, config } from 'react-spring'
import { CTX } from 'context/Store'
import Register from './Register'
import Login from './Login'
import './Auth.scss'

const Auth = () => {
  const [appState, updateState] = useContext(CTX)
  const { authPage, authType } = appState
  const trainer = authType === 'trainer'

  const setCurrentShow = (page) => updateState({ type: 'CHANGE_AUTH_PAGE', payload: { page } })

  const setAuthOpen = () => updateState({ type: 'TOGGLE_AUTH' })

  const animation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.smooth,
  })

  return (
    <animated.div style={animation} className="auth">
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
  )
}

export default Auth
