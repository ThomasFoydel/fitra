import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CTX } from 'context/Store';
import AuthPageToggle from './AuthPageToggle';
import Facebook from './Facebook';
import Google from './Google';

const Login = ({ setCurrentShow, setAuthOpen, trainer }) => {
  const [, updateState] = useContext(CTX);
  const [errorMessage, setErrorMessage] = useState('');
  const [userForm, setUserForm] = useState({});

  const handleChange = (e) => {
    let { id, value } = e.target;
    setUserForm({ ...userForm, [id]: value });
  };

  const type = trainer ? 'trainer' : 'client';

  const handleSubmit = (e) => {
    axios
      .post(`/api/${type}/login`, userForm)
      .then((result) => {
        if (result.data.err) {
          setErrorMessage(result.data.err);
        } else {
          let { user, token } = result.data.data;
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
  const fbResponse = ({ accessToken, userID }) => {
    if (!accessToken || !userID)
      return setErrorMessage('One or more fields missing');
    axios
      .post(`/api/${type}/fblogin`, { accessToken, userID })
      .then((res) => {
        let { err } = res.data;
        if (err) return setErrorMessage(err);
        let { user, token } = res.data.data;
        updateState({ type: 'LOGIN', payload: { user, token } });
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const googleResponse = (res) => {
    console.log('googleResponse: ', res);
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
        <p className='tos'>
          by logging in, you agree to our{' '}
          <a target='_blank' href='/terms-of-use'>
            Terms Of Use
          </a>
        </p>
        <p className='pp'>
          and our{' '}
          <a target='_blank' href='/privacy-policy'>
            Privacy Policy
          </a>
        </p>
        <button className='submit-btn' onClick={handleSubmit}>
          Login
        </button>

        <p className='error-msg'>{errorMessage}</p>
        <Facebook callback={fbResponse} />
        <Google googleResponse={googleResponse} />

        <button
          className='signup-btn'
          onClick={() => setCurrentShow('register')}
        >
          No account? <strong>Sign up</strong>
        </button>
        <AuthPageToggle />
      </div>
    </>
  );
};

export default Login;
