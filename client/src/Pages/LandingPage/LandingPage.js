import React from 'react';
import './LandingPage.scss';
import SignInSignUp from 'Components/SignInSignUp/SignInSignUp';
import { Link } from 'react-router-dom';

const LandingPage = ({ setCurrentShow, setAuthOpen }) => {
  return (
    <div className='landingpage'>
      <h2 className="landing-title">FITRA</h2>
      <SignInSignUp setAuthOpen={setAuthOpen} setCurrentShow={setCurrentShow} />

      <Link to='/coachportal' className='coachportal-btn'>
        coach portal
      </Link>
    </div>
  );
};

export default LandingPage;
