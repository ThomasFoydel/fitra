import React, { useState, useContext } from 'react';
import axios from 'axios';
import { CTX } from 'context/Store';
import './IntroMessage.scss';
const IntroMessage = ({ id }) => {
  const [appState, updateState] = useContext(CTX);
  const [message, setMessage] = useState('');

  const handleChange = ({ target: { value } }) => setMessage(value);

  const handleSubmit = () => {
    const newMsg = {
      userId: id,
      message,
      sender: appState.user.ids,
      name: appState.user.name,
    };

    axios.post('/api/message', { message: newMsg }).then((result) => {
      console.log({ result });
    });
  };

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
      <button onClick={handleSubmit}>submit</button>
    </div>
  );
};

export default IntroMessage;
