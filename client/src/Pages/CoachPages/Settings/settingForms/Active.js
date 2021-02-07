import React from 'react';
import axios from 'axios';

const Active = ({ props: { onError, type, onComplete, token, active } }) => {
  const handleActive = async ({ target: { checked } }) => {
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
    <div className='active'>
      <h3>Active</h3>
      <label className='switch' htmlFor='active'>
        <input
          checked={active || false}
          type='checkbox'
          onChange={handleActive}
          id='active'
          data-testid='active-btn'
        />
        <span className='slider round'></span>
      </label>
    </div>
  );
};

export default Active;
