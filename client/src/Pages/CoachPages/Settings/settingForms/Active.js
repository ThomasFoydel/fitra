import React from 'react';
import axios from 'axios';

const Active = ({ props: { onError, type, onComplete, token, active } }) => {
  const handleActive = ({ target: { checked } }) => {
    axios
      .post(
        `/api/user/settings/${type}/active`,
        { value: checked },
        { headers: { 'x-auth-token': token } }
      )
      .then(({ data: { active, err } }) => {
        if (err) return onError(err);
        onComplete({ type: 'active', value: active });
      })
      .catch((err) => onError(err));
  };

  return (
    <div className='dark-mode'>
      <span>Active</span>
      <label className='switch' htmlFor='active'>
        <input
          checked={active}
          type='checkbox'
          onChange={handleActive}
          id='active'
        />
        <span className='slider round'></span>
      </label>
    </div>
  );
};

export default Active;
