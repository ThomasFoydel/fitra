import React, { useContext } from 'react';

import yogatrainer from 'imgs/yogacoach.jpg';
import './TrainerLandingPage.scss';
import { CTX } from 'context/Store';
import { Redirect } from 'react-router-dom';

const TrainerLandingPage = () => {
  const [appState, updateState] = useContext(CTX);
  const { isLoggedIn } = appState;

  const openAuth = () => {
    updateState({ type: 'CHANGE_AUTH_PAGE', payload: { page: 'register' } });
    updateState({ type: 'CHANGE_AUTH_TYPE', payload: { type: 'trainer' } });
    updateState({ type: 'TOGGLE_AUTH' });
  };
  return (
    <div className='trainer-landingpage'>
      <div className='landing-background' />
      <img src={yogatrainer} alt='yoga coach' className='image2' />
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
