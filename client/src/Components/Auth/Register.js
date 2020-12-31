import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AuthPageToggle from './AuthPageToggle';

const Register = ({ setCurrentShow, setAuthOpen, trainer }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [userForm, setUserForm] = useState({});

  const handleChange = (e) => {
    let { id, value } = e.target;
    setUserForm({ ...userForm, [id]: value });
  };

  const handleSubmit = () => {
    axios
      .post(`/api/${trainer ? 'trainer' : 'client'}/register`, userForm)
      .then((result) => {
        if (result.data.err) {
          setErrorMessage(result.data.err);
        } else {
          setCurrentShow('login');
        }
      })
      .catch((err) => {
        console.error('register error: ', err);
      });
  };

  useEffect(() => {
    let subscribed = true;
    setTimeout(() => {
      if (subscribed) {
        setErrorMessage('');
      }
    }, 3400);
    return () => (subscribed = false);
  }, [errorMessage]);

  const handleKeyDown = (e) => {
    if (e.charCode === 13) {
      handleSubmit();
    }
  };

  return (
    <div className='register'>
      <button className='closeauth-btn' onClick={() => setAuthOpen(false)}>
        <i className='fas fa-times fa-3x close-btn'></i>
      </button>
      <h2>{trainer && 'Trainer '}Register</h2>
      <input id='name' type='text' placeholder='name' onChange={handleChange} />
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
      <input
        id='confirmpassword'
        type='password'
        placeholder='confirm password'
        onChange={handleChange}
        onKeyPress={handleKeyDown}
      />
      <p>
        by registering, you agree to our{' '}
        <a target='_blank' href='/terms-of-use'>
          Terms Of Use
        </a>
      </p>
      <p>
        and our{' '}
        <a target='_blank' href='/privacy-policy'>
          Privacy Policy
        </a>
      </p>
      <button className='submit-btn' onClick={handleSubmit}>
        Submit
      </button>
      <button className='signin-btn' onClick={() => setCurrentShow('login')}>
        I already have an account
      </button>
      <p className='error-msg'>{errorMessage}</p>
      <AuthPageToggle />
    </div>
  );
};

export default Register;
