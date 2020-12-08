import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CTX } from 'context/Store';
import AuthPageToggle from './AuthPageToggle';

const Login = ({ setCurrentShow, setAuthOpen, trainer }) => {
  const [, updateState] = useContext(CTX);
  const [errorMessage, setErrorMessage] = useState('');
  const [userForm, setUserForm] = useState({});

  const handleChange = (e) => {
    let { id, value } = e.target;
    setUserForm({ ...userForm, [id]: value });
  };

  const handleSubmit = (e) => {
    axios
      .post(`/api/${trainer ? 'trainer' : 'client'}/login`, userForm)
      .then((result) => {
        if (result.data.err) {
          setErrorMessage(result.data.err);
        } else {
          let { user, token } = result.data.data;
          user.userType = trainer ? 'trainer' : 'client';
          updateState({ type: 'LOGIN', payload: { user, token } });
        }
      })
      .catch((err) => {
        console.error('register error: ', err);
      });
  };

  useEffect(() => {
    let subscribed = true;
    if (errorMessage) {
      setTimeout(() => {
        if (subscribed) {
          setErrorMessage('');
        }
      }, 3000);
    }
    return () => (subscribed = false);
  }, [errorMessage]);

  const handleKeyDown = (e) => {
    if (e.charCode === 13) {
      handleSubmit();
    }
  };

  return (
    <>
      <div className='login'>
        <button className='closeauth-btn' onClick={() => setAuthOpen(false)}>
          <i className='fas fa-times fa-3x close-btn'></i>
        </button>
        <h2>{trainer && 'Trainer '}Login</h2>
        <input
          id='email'
          type='text'
          placeholder='email'
          onChange={handleChange}
          onKeyPress={handleKeyDown}
        />
        <input
          id='password'
          type='password'
          placeholder='password'
          onChange={handleChange}
          onKeyPress={handleKeyDown}
        />
        <button className='submit-btn' onClick={handleSubmit}>
          Login
        </button>
        <button
          className='signup-btn'
          onClick={() => setCurrentShow('register')}
        >
          Sign up
        </button>

        <p className='error-msg'>{errorMessage}</p>
        <AuthPageToggle />
      </div>
    </>
  );
};

export default Login;
