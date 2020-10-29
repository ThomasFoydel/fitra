import React, { useState, useContext } from 'react';
import axios from 'axios';
import { CTX } from 'context/Store';
import './IntroMessage.scss';
const IntroMessage = () => {
  const [appState, updateState] = useContext(CTX);
  const [message, setMessage] = useState('');

  const handleChange = ({ target: { value } }) => setMessage(value);

  const handleSubmit = () => {
    // axios.post("/api/message")
  };
  return (
    <div className='intro-message'>
      <h2>intro message</h2>
      <textarea
        onChange={handleChange}
        value={message}
        name=''
        id=''
        cols='30'
        rows='10'
      ></textarea>
      <button onClick={handleSubmit}>submit</button>
    </div>
  );
};

export default IntroMessage;
