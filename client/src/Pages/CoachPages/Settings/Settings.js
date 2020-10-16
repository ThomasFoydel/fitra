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
    <div className={`settings dm-${darkmode}`}>
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
        {/* <input type='text' /> */}
      </div>
    </div>
  );
};

export default Settings;

// import React, { useState, useContext } from 'react';
// import './Settings.scss';
// import axios from 'axios';
// import { CTX } from 'context/Store';

// const Settings = () => {
//   const [appState, updateState] = useContext(CTX);
//   let { type } = appState.user;
//   const [updateForm, setUpdateForm] = useState();

//   const handleChange = (e) => {
//     let { id, value } = e.target;
//     setUpdateForm({ ...updateForm, [id]: value });
//   };

//   const submitUpdate = () => {
//     axios
//       .post(`/api/${type}/settings`, updateForm)
//       .then((res) => console.log('settings update res: ', res))
//       .catch((err) => console.log('err: ', err));
//   };
//   return (
//     <div className='settings'>
//       <h2>settings</h2>
//       <input id='darkmode' placeholder='' onChange={handleChange} type='text' />

//       <input type='radio' id='darkmode' value='louie' />
//       <label htmlFor='darkmode'>Dark Mode</label>
//     </div>
//   );
// };

// export default Settings;
