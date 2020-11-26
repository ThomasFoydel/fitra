import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { CTX } from 'context/Store';
import './IntroMessage.scss';

const IntroMessage = ({ id, toggle }) => {
  const [appState, updateState] = useContext(CTX);
  const [message, setMessage] = useState('');
  const [complete, setComplete] = useState(false);

  const handleChange = ({ target: { value } }) => setMessage(value);

  const handleSubmit = () => {
    let valid = id && message && appState.user.id && appState.user.name;
    if (!valid) return;
    const newMsg = {
      userId: id,
      message,
      sender: appState.user.id,
      name: appState.user.name,
    };

    axios.post('/api/message', newMsg).then(({ data }) => {
      updateState({ type: 'NEW_MESSAGE', payload: { message: data } });
      setComplete(true);
    });
  };

  useEffect(() => {
    let subscribed = true;
    if (complete) {
      setTimeout(() => {
        if (subscribed) toggle();
      }, 2800);
    }
    return () => (subscribed = false);
  }, [complete]);

  /* 

  userId, message, sender, name 
  
  const newMessage = new Message({
    authorName: name,
    sender,
    receiver: userId,
    content: message,
    participants: [sender, userId],
  }); 

  */
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
      {complete && <p>message sent!</p>}
      <button onClick={handleSubmit}>send</button>
    </div>
  );
};

export default IntroMessage;
