import React, { useState } from 'react';
import axios from 'axios';

const ChatBox = ({ userId, userName, currentThread, update, isTrainer }) => {
  const [text, setText] = useState('');
  const submit = () => {
    if (!text) return;
    let message = {
      userId: currentThread,
      message: text,
      sender: userId,
      name: userName,
      fromTrainer: isTrainer,
    };
    axios
      .post('/api/message/', message)
      .then(({ data }) => {
        update(data);
        setText('');
      })
      .catch((err) => console.log('chatbox err: ', err));
  };
  const handleKeyPress = ({ charCode }) => {
    if (charCode === 13) submit();
  };
  return (
    <>
      <input
        onChange={(e) => setText(e.target.value)}
        type='text'
        className='input'
        value={text}
        onKeyPress={handleKeyPress}
      />
      <button onClick={submit}>send</button>
    </>
  );
};

export default ChatBox;
