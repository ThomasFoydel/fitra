import React, { useState, useEffect, useContext, useRef } from 'react';
import './Settings.scss';
import { CTX } from 'context/Store';
import { Link } from 'react-router-dom';
import TagEditor from './settingForms/TagEditor';
import RateEditor from './settingForms/RateEditor';
import DarkMode from './settingForms/DarkMode';

const Settings = () => {
  const [appState, updateState] = useContext(CTX);
  const [rateInput, setRateInput] = useState('');
  const [err, setErr] = useState('');
  console.log(appState.settings);
  const { type, token, id } = appState.user;
  const { darkmode, rate } = appState.settings || {};

  // const handleRate = ({ target: { value } }) => {
  //   axios
  //     .post(
  //       `/api/user/settings/${type}/rate`,
  //       { value },
  //       { headers: { 'x-auth-token': token } }
  //     )
  //     .then(({ data: { rate } }) => {
  //       updateState({
  //         type: 'CHANGE_RATE',
  //         payload: { rate },
  //       });
  //     })
  //     .catch((err) => console.log('rate error: ', err));
  // };

  // const handleSettingChange = () => {
  //   axios
  //     .post(
  //       `/api/user/settings/${type}/${id}`,
  //       { checked, value: rateInput },
  //       { headers: { 'x-auth-token': token } }
  //     )
  //     .then(({ data }) => {
  //       updateState({
  //         type: `CHANGE_${id.toUpperCase()}`,
  //         payload: { id, value: data[id] },
  //       });
  //     })
  //     .catch((err) => console.log('darkmode error: ', err));
  // };

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
