import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
// import IntroMessage from 'Components/IntroMessage/IntroMessage';
// import Auth from 'Components/Auth/Auth';
import yogatrainer from 'imgs/yogacoach.jpg';
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
    updateState({ type: 'CHANGE_AUTH_PAGE', payload: { page: 'register' } });
    updateState({ type: 'CHANGE_AUTH_TYPE', payload: { type: 'trainer' } });
    updateState({ type: 'TOGGLE_AUTH' });
  };
  return (
    <div className='trainer-landingpage'>
      <img src={yogatrainer} alt='yoga coach' className='landing-background' />
      <div className='overlay trainer-overlay'></div>
      {isLoggedIn && <Redirect to='/coachportal/home' />}
      <h2 className='heading'>
        STREAMLINE
        <br />
        YOUR
        <br />
        WORKFLOW
        <button onClick={openAuth}>Get Started</button>
      </h2>
    </div>
  );
};

export default TrainerLandingPage;
