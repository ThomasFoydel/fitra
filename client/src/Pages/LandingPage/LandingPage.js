import React, { useState, useEffect, useContext } from 'react';
import './LandingPage.scss';
import SignInSignUp from 'Components/SignInSignUp/SignInSignUp';
import { Link, Redirect } from 'react-router-dom';
import { CTX } from 'context/Store';

const LandingPage = ({ setCurrentShow, setAuthOpen }) => {
  const [appState, updateState] = useContext(CTX);
  const [redirect, setRedirect] = useState(false);
  // console.log({ redirect, user: appState.user });
  // useEffect(() => {
  //   if (appState.isLoggedIn) setRedirect = true;
  // }, []);
  return (
    <div className='landing-page'>
      {redirect && (
        <Redirect
          to={`/${appState.user.type === 'trainer' && 'coachportal'}/home `}
        />
      )}
      <h2 className='landing-title'>
        SHARPEN
        <br />
        YOUR BODY
      </h2>

      <Link to='/trainers' className='trainers-link'>
        Get Started
      </Link>

      <Link to='/coachportal' className='coachportal-btn'>
        coach portal
      </Link>
    </div>
  );
};

export default LandingPage;
