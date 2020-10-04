import React, { useState, useContext } from 'react';
import './Settings.scss';
import axios from 'axios';
import { CTX } from 'context/Store';

const Settings = () => {
  const [appState, updateState] = useContext(CTX);
  let { type } = appState.user;
  const [updateForm, setUpdateForm] = useState();

  const handleChange = (e) => {
    let { id, value } = e.target;
    setUpdateForm({ ...updateForm, [id]: value });
  };

  const submitUpdate = () => {
    axios
      .post(`/api/${type}/settings`, updateForm)
      .then((res) => console.log('settings update res: ', res))
      .catch((err) => console.log('err: ', err));
  };
  return (
    <div className='settings'>
      <h2>settings</h2>
      <input id='darkmode' placeholder='' onChange={handleChange} type='text' />

      <input type='radio' id='darkmode' value='louie' />
      <label for='darkmode'>Dark Mode</label>
    </div>
  );
};

export default Settings;
