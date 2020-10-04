import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

import './Auth.scss';

const Auth = ({ setAuthOpen, currentShow, setCurrentShow, trainer }) => {
  return (
    <div className='auth'>
      {currentShow === 'register' ? (
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
