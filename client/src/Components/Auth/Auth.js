import React, { useState, useContext } from 'react';
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

  return (
    <div className='auth'>
      {authPage === 'register' ? (
        <Register
          setCurrentShow={setCurrentShow}
          setAuthOpen={setAuthOpen}
          trainer={trainer}
        />
      ) : (
        <Login
          setCurrentShow={setCurrentShow}
          setAuthOpen={setAuthOpen}
          trainer={trainer}
        />
      )}
    </div>
  );
};

export default Auth;
