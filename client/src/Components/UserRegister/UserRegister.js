import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CTX } from 'context/Store';
import './UserRegister.scss';

const UserRegister = ({ setShowRegister }) => {
  const [appState, updateState] = useContext(CTX);
  const [form, setForm] = useState({});
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = ({ target: { id, value } }) => {
    setForm((form) => {
      return { ...form, [id]: value };
    });
  };

  const handleSubmit = () => {
    axios
      .post('/api/client/register', form)
      .then((result) => {
        if (result.data.err) {
          setErrorMessage(result.data.err);
        } else {
          setShowRegister(false);
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
    <div className='register-backdrop'>
      <div className='register'>
        <button onClick={() => setShowRegister(false)}>close</button>
        <input
          type='text'
          onChange={handleChange}
          id='name'
          placeholder='name'
          onKeyPress={handleKeyDown}
        />
        <input
          type='email'
          onChange={handleChange}
          id='email'
          placeholder='email'
          onKeyPress={handleKeyDown}
        />
        <input
          type='password'
          onChange={handleChange}
          id='password'
          placeholder='password'
          onKeyPress={handleKeyDown}
        />
        <input
          type='password'
          onChange={handleChange}
          id='confirmpassword'
          placeholder='confirmpassword'
          onKeyPress={handleKeyDown}
        />
        <p>
          by registering, you agree to our{' '}
          <a target='_blank' href='/terms-of-use'>
            Terms Of Use
          </a>
        </p>
        <button onClick={handleSubmit}>register</button>
        <p className='error-msg'>{errorMessage}</p>
      </div>
    </div>
  );
};

export default UserRegister;
