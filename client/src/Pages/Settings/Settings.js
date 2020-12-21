import React, { useContext } from 'react';
import './Settings.scss';
import axios from 'axios';
import { CTX } from 'context/Store';
import { Link } from 'react-router-dom';

const Settings = () => {
  const [appState, updateState] = useContext(CTX);
  const { type, token } = appState.user;
  const { darkmode } = appState.settings;

  const handleDarkMode = ({ target: { checked } }) => {
    axios
      .post(
        `/api/user/settings/${type}/darkmode`,
        { checked: checked },
        { headers: { 'x-auth-token': token } }
      )
      .then(({ data: { darkmode } }) => {
        updateState({
          type: 'CHANGE_SETTINGS',
          payload: { type: 'darkmode', value: darkmode },
        });
      })
      .catch((err) => console.log('darkmode error: ', err));
  };
  return (
    <>
      <div className='background' />
      <div className='overlay' />
      <div className={`settings dm-${darkmode}`}>
        <h2 className='header center'>Settings</h2>

        <div className='form'>
          <div className='setting-item'>
            <span>darkmode</span>
            <label className='switch' htmlFor='darkmode'>
              <input
                checked={darkmode}
                type='checkbox'
                onChange={handleDarkMode}
                id='darkmode'
              />
              <span className='slider round'></span>
            </label>
          </div>
          <div className='setting-item'>
            <Link to='/terms-of-use'>terms of use</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
