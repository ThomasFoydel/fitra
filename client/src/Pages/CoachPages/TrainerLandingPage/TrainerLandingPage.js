import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';

import Auth from 'Components/Auth/Auth';

import './TrainerLandingPage.scss';
import { CTX } from 'context/Store';
import { Redirect } from 'react-router-dom';

const TrainerLandingPage = () => {
  const [appState, updateState] = useContext(CTX);
  const { isLoggedIn } = appState;
  const [authOpen, setAuthOpen] = useState(false);
  const [currentShow, setCurrentShow] = useState('register');

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
  return (
    <div className='coachportal'>
      {isLoggedIn && <Redirect to='/coachportal/home' />}
      <h1>trainer landing page</h1>

      {!isLoggedIn && authOpen && (
        <Auth
          trainer={true}
          setAuthOpen={setAuthOpen}
          currentShow={currentShow}
          setCurrentShow={setCurrentShow}
        />
      )}

      <button onClick={() => setAuthOpen(!authOpen)}>Login / Register</button>
    </div>
  );
};

export default TrainerLandingPage;
