import React, { useState, useEffect, useContext, useRef } from 'react';
import './Settings.scss';
import axios from 'axios';
import { CTX } from 'context/Store';

const TagEditor = () => {
  const [appState, updateState] = useContext(CTX);
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

export default TagEditor;
