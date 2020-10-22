import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CTX } from 'context/Store';
import './UserRegister.scss';

const UserRegister = ({ setCurrentShow }) => {
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

  return (
    <div className='register'>
      <input type='text' onChange={handleChange} id='name' placeholder='name' />
      <input
        type='email'
        onChange={handleChange}
        id='email'
        placeholder='email'
      />
      <input
        type='password'
        onChange={handleChange}
        id='password'
        placeholder='password'
      />
      <input
        type='password'
        onChange={handleChange}
        id='confirmpassword'
        placeholder='confirmpassword'
      />
      <p>
        by registering, you agree to our{' '}
        <a target='_blank' href='/terms-of-use'>
          Terms Of Use
        </a>
      </p>
      <button onClick={handleSubmit}>register</button>
    </div>
  );
};

export default UserRegister;
