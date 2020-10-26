import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import Auth from 'Components/Auth/Auth';

import './TrainerLandingPage.scss';
import { CTX } from 'context/Store';
import { Redirect } from 'react-router-dom';

const TrainerLandingPage = () => {
  const [appState, updateState] = useContext(CTX);
  const { isLoggedIn, showAuth } = appState;

  useEffect(() => {
    let token = localStorage.getItem('fitr-token');
    if (!token) return;
    axios
      .get('/trainer-auth', {
        headers: {
          'x-auth-token': token,
        },
      })
      .then((res) => console.log('trainer auth res: ', res))
      .catch((err) => console.log('err: ', err));
  }, []);

  const openAuth = () => {
    updateState({ type: 'CHANGE_AUTH_TYPE', payload: { type: 'trainer' } });
    updateState({ type: 'TOGGLE_AUTH' });
  };
  return (
    <div className='coachportal'>
      {isLoggedIn && <Redirect to='/coachportal/home' />}
      <h1>trainer landing page</h1>

      <button onClick={openAuth}>Login / Register</button>
    </div>
  );
};

export default TrainerLandingPage;
