import React, { useState } from 'react';
import axios from 'axios';

const RateEditor = ({ props: { id, rate, onComplete, onError, token } }) => {
  const [input, setInput] = useState(rate);

  const handleSubmit = () => {
    axios
      .post(`/api/user/settings/rate/${id}`, input, {
        headers: { 'x-auth-token': token },
      })
      .then((res) => {
        onComplete(res);
      })
      .catch((err) => {
        onError(err);
      });
  };

  return (
    <div className='rate-editor'>
      {rate ? <div>current rate: {rate}</div> : <div>rate not set</div>}
      <input
        type='text'
        onChange={({ target: { value } }) => setInput(value)}
        placeholder='rate'
        value={input}
      />
      <button onClick={handleSubmit}>update</button>
    </div>
  );
};

export default RateEditor;
