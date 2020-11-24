import React, { useState, useContext } from 'react';
import './Settings.scss';
import axios from 'axios';
import { CTX } from 'context/Store';

const Settings = () => {
  const [appState, updateState] = useContext(CTX);
  const { type, id, token } = appState.user;
  const { darkmode } = appState.settings || {};
  const [formData, setFormData] = useState({});
  // const submit = () => {
  //   axios.post(`/api/${type}/settings`, formData, {
  //     headers: { 'x-auth-token': token },
  //   });
  // };
  // const handleChange = ({ target: { value, id } }) => {
  //   setFormData({ ...formData, [id]: value });
  // };

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
      .catch((err) => console.log('darkmode error'));
  };
  return (
    <div className={`trainer-settings dm-${darkmode}`}>
      <div className='background' />
      <div className='overlay' />
      <h1 className='header center'>Settings</h1>

      <div className='form'>
        <h2>darkmode</h2>
        <label className='switch' htmlFor='darkmode'>
          <input
            checked={darkmode}
            type='checkbox'
            onChange={handleDarkMode}
            id='darkmode'
          />
          <span className='slider round'></span>
        </label>
        <TagEditor props={{ appState, updateState }} />
      </div>
    </div>
  );
};

const TagEditor = ({ props: { appState, updateState } }) => {
  const [inputVal, setInputVal] = useState('');
  const [err, setErr] = useState('');
  let { token, id } = appState.user;

  const handleChange = ({ target: { value } }) => {
    setInputVal(value);
  };

  const handleAddTag = () => {
    axios
      .post(
        '/api/trainer/edit-tags',
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
    console.log('delete!: ', id);
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
        console.log({ data });
      })
      .catch((err) => {
        console.log({ err });
      });
  };

  return (
    <div className='tag-editor'>
      {appState.user.tags &&
        appState.user.tags.map((tag) => (
          <div className='tag' key={tag}>
            {tag}
            <button id={tag} onClick={handleDelete}>
              X
            </button>
          </div>
        ))}
      <input type='text' value={inputVal} onChange={handleChange} />
      <p>{err}</p>
      <button onClick={handleAddTag}>add tag</button>
    </div>
  );
};

export default Settings;
