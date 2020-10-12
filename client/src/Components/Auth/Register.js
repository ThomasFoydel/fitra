import React, { useState, useEffect } from 'react';
import axios from 'axios';

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
        close
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

      <button className='submit-btn' onClick={handleSubmit}>
        Submit
      </button>
      <button className='signin-btn' onClick={() => setCurrentShow('login')}>
        Sign in
      </button>
      <p className='error-msg'>{errorMessage}</p>
    </div>
  );
};

export default Register;