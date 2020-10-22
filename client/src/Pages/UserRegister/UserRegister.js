import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CTX } from 'context/Store';

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
      <input
        type='text'
        onChange={handleChange}
        id='name'
        value={form.name}
        placeholder='name'
      />
      <input
        type='email'
        onChange={handleChange}
        id='email'
        value={form.email}
        placeholder='email'
      />
      <input
        type='password'
        onChange={handleChange}
        id='password'
        value={form.password}
        placeholder='password'
      />
      <input
        type='password'
        onChange={handleChange}
        id='confirmpassword'
        value={form.confirmpassword}
        placeholder='confirmpassword'
      />
      <button onClick={handleSubmit}>register</button>
    </div>
  );
};

export default UserRegister;
