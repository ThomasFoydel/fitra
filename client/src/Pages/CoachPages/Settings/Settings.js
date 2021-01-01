import React, { useState, useContext } from 'react';
import './Settings.scss';
import { CTX } from 'context/Store';
import { Link } from 'react-router-dom';
import TagEditor from './settingForms/TagEditor';
import RateEditor from './settingForms/RateEditor';
import DarkMode from './settingForms/DarkMode';

const Settings = () => {
  const [appState, updateState] = useContext(CTX);
  const [err, setErr] = useState('');
  const { type, token, id } = appState.user;
  const { darkmode, rate } = appState.settings || {};

  const onComplete = ({ type, value }) => {
    console.log('complete', type, value);
    updateState({ type: 'CHANGE_SETTINGS', payload: { type, value } });
  };

  const onError = ({ err }) => {
    setErr(err);
  };

  return (
    <>
      <div className='background' />
      <div className='overlay' />
      <div className={`trainer-settings dm-${darkmode}`}>
        <h2 className='header center'>Settings</h2>

        <div className='form'>
          <div className='setting-item'>
            <DarkMode props={{ onError, type, onComplete, token, darkmode }} />
          </div>
          <div className='setting-item'>
            <TagEditor />
          </div>

          <div className='setting-item'>
            <RateEditor props={{ id, rate, onComplete, onError, token }} />
          </div>

          <div className='setting-item'>
            <Link to='/terms-of-use'>terms of use</Link>
          </div>
          <div className='setting-item'>
            <Link to='/privacy-policy'>privacy policy</Link>
          </div>
          <div className='setting-item'>
            <Link className='delete-btn' to='/delete_my_account'>
              delete my account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
