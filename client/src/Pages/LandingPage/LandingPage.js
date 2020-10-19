import React from 'react';
import './LandingPage.scss';
import SignInSignUp from 'Components/SignInSignUp/SignInSignUp';
import { Link } from 'react-router-dom';

const LandingPage = ({ setCurrentShow, setAuthOpen }) => {
  return (
    <div className='landing-page'>
      <h2 className='landing-title'>
        SHARPEN
        <br />
        YOUR BODY
      </h2>
      {/* <SignInSignUp setAuthOpen={setAuthOpen} setCurrentShow={setCurrentShow} /> */}

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
