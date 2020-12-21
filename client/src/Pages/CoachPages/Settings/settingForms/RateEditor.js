import React, { useState } from 'react';
import axios from 'axios';

const RateEditor = ({ props: { id, rate, onComplete, onError, token } }) => {
  const [input, setInput] = useState(rate || 0);

  const handleSubmit = () => {
    axios
      .post(
        `/api/user/settings/trainer/rate/`,
        { value: input },
        {
          headers: { 'x-auth-token': token },
        }
      )
      .then(({ data: { settings }, err }) => {
        if (err) onError(err);
        onComplete({ type: 'rate', value: settings.rate });
      })
      .catch((err) => {
        onError({ err });
      });
  };
  return (
    <div className='rate-editor'>
      {rate ? <div>current rate: {rate}</div> : <div>rate not set</div>}
      <input
        type='number'
        onChange={({ target: { value } }) => setInput(value)}
        placeholder='rate'
        value={input}
      />
      <button onClick={handleSubmit}>update</button>
    </div>
  );
};

export default RateEditor;
