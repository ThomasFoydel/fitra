import React, { useState, useEffect, useContext, useRef } from 'react';
import './Settings.scss';
import axios from 'axios';
import { CTX } from 'context/Store';
import { Link } from 'react-router-dom';
import TagEditor from './TagEditor';

const Settings = () => {
  const [appState, updateState] = useContext(CTX);
  const [rateInput, setRateInput] = useState('');
  console.log(appState.settings);
  const { type, token } = appState.user;
  const { darkmode, rate } = appState.settings || {};

  const handleDarkMode = ({ target: { checked } }) => {
    axios
      .post(
        `/api/user/settings/${type}/darkmode`,
        { checked: checked },
        { headers: { 'x-auth-token': token } }
      )
      .then(({ data: { darkmode } }) => {
        updateState({
          type: 'CHANGE_DARKMODE',
          payload: { darkmode },
        });
      })
      .catch((err) => console.log('darkmode error: ', err));
  };

  const handleRate = ({ target: { value } }) => {
    axios
      .post(
        `/api/user/settings/${type}/rate`,
        { value },
        { headers: { 'x-auth-token': token } }
      )
      .then(({ data: { rate } }) => {
        updateState({
          type: 'CHANGE_RATE',
          payload: { rate },
        });
      })
      .catch((err) => console.log('rate error: ', err));
  };

  const handleSettingChange = ({ target: { checked, id } }) => {
    axios
      .post(
        `/api/user/settings/${type}/${id}`,
        { checked, value: rateInput },
        { headers: { 'x-auth-token': token } }
      )
      .then(({ data }) => {
        updateState({
          type: `CHANGE_${id.toUpperCase()}`,
          payload: { id, value: data[id] },
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
                onChange={handleSettingChange}
                id='darkmode'
              />
              <span className='slider round'></span>
            </label>
          </div>
          <div className='setting-item'>
            <TagEditor />
          </div>

          <div className='setting-item'>
            {rate ? <div>current rate: {rate}</div> : <div>rate not set</div>}
            <input
              type='text'
              // onChange={handleChange}
              placeholder='rate'
              value={rate}
            />
            <button onClick={handleSettingChange}>update</button>
          </div>

          <div className='setting-item'>
            <Link to='/terms-of-use'>terms of use</Link>
          </div>
        </div>
      </div>
    </>
  );
};

// const SettingInput = () => {
//   const [input, setInput] = useState("");

//     const handleSetting = ({ target: { checked, id, value } }) => {
//       axios
//         .post(
//           `/api/user/settings/${type}/${id}`,
//           { checked, value },
//           { headers: { 'x-auth-token': token } }
//         )
//         .then(({ data: { value } }) => {
//           updateState({
//             type: `CHANGE_${id.toUpperCase()}`,
//             payload: { value },
//           });
//         })
//         .catch((err) => console.log('darkmode error: ', err));
//     };

//     return (<div className="setting-input">

//     </div>)
// }

export default Settings;
