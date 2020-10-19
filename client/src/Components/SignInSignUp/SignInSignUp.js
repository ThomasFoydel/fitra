import React from 'react';
import './SignInSignUp.scss';

const SignInSignUp = ({ setAuthOpen, setCurrentShow }) => {
  const openAuth = (e) => {
    let { id } = e.target;
    setAuthOpen(true);
    setCurrentShow(id);
  };

  return (
    <div className='signin-signup'>
      <button id='login' onClick={openAuth}>
        Sign in
      </button>

      <button id='register' onClick={openAuth}>
        Sign up
      </button>
    </div>
  );
};

export default SignInSignUp;
