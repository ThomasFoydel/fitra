import React, { useState, useEffect, useContext, useRef } from 'react';
import './Settings.scss';
import axios from 'axios';
import { CTX } from 'context/Store';
import { Link } from 'react-router-dom';

const Settings = () => {
  const [appState, updateState] = useContext(CTX);
  const { type, token } = appState.user;
  const { darkmode } = appState.settings || {};

  const handleDarkMode = ({ target: { checked } }) => {
    axios
      .post(
        `/api/user/settings/${type}/darkmode`,
        { checked: checked },
        { headers: { 'x-auth-token': token } }
      )
      .then(({ data: { darkmode } }) => {
        updateState({
          type: 'TOGGLE_DARKMODE',
          payload: { darkmode },
        });
      })
      .catch((err) => console.log('darkmode error: ', err));
  };

  return (
    <>
      <div className='background' />
      <div className='overlay' />
      <div className={`trainer-settings dm-${darkmode}`}>
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
            <TagEditor props={{ appState, updateState }} />
          </div>
          <div className='setting-item'>
            <Link to='/terms-of-use'>terms of use</Link>
          </div>
        </div>
      </div>
    </>
  );
};

const TagEditor = ({ props: { appState, updateState } }) => {
  let maxMet = appState.user.tags && appState.user.tags.length >= 4;
  const [inputVal, setInputVal] = useState('');
  const [err, setErr] = useState('');
  let { token } = appState.user;

  const handleChange = ({ target: { value } }) => {
    setInputVal(value);
  };

  const handleAddTag = () => {
    axios
      .post(
        '/api/trainer/add-tag',
        { value: inputVal },
        {
          headers: { 'x-auth-token': token },
        }
      )
      .then(({ data }) => {
        let { err } = data;
        if (err) return setErr(err);
        updateState({ type: 'CHANGE_TAGS', payload: { tags: data } });
        setInputVal('');
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  const handleDelete = ({ target: { id } }) => {
    axios
      .post(
        '/api/trainer/delete-tag',
        { value: id },
        {
          headers: { 'x-auth-token': token },
        }
      )
      .then(({ data }) => {
        let { err } = data;
        if (err) return setErr(err);
        updateState({ type: 'CHANGE_TAGS', payload: { tags: data } });
      })
      .catch((err) => {
        console.log({ err });
      });
  };
  const handleKeyPress = ({ charCode }) => {
    if (charCode === 13) handleAddTag();
  };

  const didMountRef = useRef(false);
  useEffect(() => {
    let subscribed = true;
    if (didMountRef.current) {
      setTimeout(() => {
        if (subscribed) setErr('');
      }, 2700);
    } else didMountRef.current = true;
    return () => (subscribed = false);
  }, [err]);

  return (
    <div className='tag-editor'>
      {appState.user.tags &&
        appState.user.tags.map((tag) => (
          <div className='tag' key={tag}>
            {tag}
            <button id={tag} onClick={handleDelete}>
              <i id={tag} onClick={handleDelete} className='fas fa-times '></i>
            </button>
          </div>
        ))}
      <input
        type='text'
        value={inputVal}
        onChange={handleChange}
        onKeyPress={handleKeyPress}
      />
      <button
        className='add-btn'
        onClick={
          maxMet ? () => setErr('Tag list limited to 4 tags') : handleAddTag
        }
      >
        add tag
      </button>
      <p className='err'>{err}</p>
    </div>
  );
};

export default Settings;
