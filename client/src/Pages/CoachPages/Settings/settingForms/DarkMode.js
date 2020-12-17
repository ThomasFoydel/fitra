import React from 'react';
import axios from 'axios';

const DarkMode = ({
  props: { onError, type, onComplete, token, darkmode },
}) => {
  const handleDarkMode = ({ target: { checked } }) => {
    console.log({ checked, type, token });
    axios
      .post(
        `/api/user/settings/${type}/darkmode`,
        { checked: checked },
        { headers: { 'x-auth-token': token } }
      )
      .then(({ data: { darkmode, err } }) => {
        if (err) return onError(err);
        onComplete({ type: 'darkmode', value: darkmode });
        // updateState({
        //   type: 'CHANGE_DARKMODE',
        //   payload: { darkmode },
        // });
      })
      .catch((err) => onError(err));
  };

  return (
    <div className='dark-mode'>
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
  );
};

export default DarkMode;
