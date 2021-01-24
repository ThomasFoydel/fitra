import React, { useContext } from 'react';
import { useSpring, animated, config } from 'react-spring';
import Login from './Login';
import Register from './Register';
import { CTX } from 'context/Store';
import './Auth.scss';

const Auth = () => {
  const [appState, updateState] = useContext(CTX);
  let { authPage, authType } = appState;
  let trainer = authType === 'trainer';

  const setCurrentShow = (page) =>
    updateState({ type: 'CHANGE_AUTH_PAGE', payload: { page } });

  const setAuthOpen = () => updateState({ type: 'TOGGLE_AUTH' });

  const animation = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: config.smooth,
  });
  return (
    <animated.div style={animation} className='auth'>
      {authPage === 'register' ? (
        <Register
          props={{
            setCurrentShow,
            setAuthOpen,
            trainer,
          }}
        />
      ) : (
        <Login
          props={{
            setCurrentShow,
            setAuthOpen,
            trainer,
          }}
        />
      )}
    </animated.div>
  );
};

export default Auth;
