import React, { useContext, useEffect, useState } from 'react';
import './Messages.scss';
import axios from 'axios';
import { CTX } from 'context/Store';

const Messages = () => {
  const [appState, updateState] = useContext(CTX);
  let { messages } = appState;
  let { token, id, name } = appState.user;
  const [currentThread, setCurrentThread] = useState(null);

  const newMessage = (message) => {
    updateState({ type: 'NEW_MESSAGE', payload: { message } });
  };

  return (
    <div className='messages'>
      <div className='background'></div>
      <div className='thread-section'>
        {Object.keys(messages).map((key) => (
          <ThreadListItem
            user={key}
            key={key}
            setCurrentThread={setCurrentThread}
            currentThread={currentThread}
            token={token}
          />
        ))}
        {currentThread && (
          <Thread
            thread={messages[currentThread]}
            close={() => setCurrentThread(null)}
          />
        )}
      </div>

      <div className='chat-box'>
        {currentThread && (
          <ChatBox
            userId={id}
            userName={name}
            currentThread={currentThread}
            update={newMessage}
          />
        )}
      </div>
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////    THREADLIST    ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
const ThreadListItem = ({ user, setCurrentThread, currentThread, token }) => {
  const [userInfo, setUserInfo] = useState({});
  useEffect(() => {
    axios
      .get(`/api/user/${user}`, { headers: { 'x-auth-token': token } })
      .then(({ data: { user } }) => setUserInfo(user))
      .catch((err) => console.log('err: ', err));
  }, []);

  let current = currentThread === user;

  return (
    <div
      className={`threadlistitem ${current && 'current'}`}
      onClick={() => setCurrentThread(user)}
    >
      <img
        className='profile-pic'
        // src={`/api/image/${userInfo.profilePic}`}
        src={`/api/image/user/profilePic/${user}`}
        alt={`profile of ${userInfo.name}`}
      />
      <span>{userInfo.name}</span>
      {/* {!current && <button onClick={() => setCurrentThread(user)}>open</button>} */}
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////   THREAD   /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
const Thread = ({ thread, close }) => {
  return (
    <div className='thread'>
      <button onClick={close} className='close-btn'>
        <i className='fa fa-times' aria-hidden='true'></i>
      </button>
      {thread.map((msg) => (
        <div className='message' key={msg._id}>
          <img
            className='profile-pic'
            src={`/api/image/user/profilePic/${msg.sender}`}
          ></img>
          <strong>{msg.authorName}</strong>
          {msg.content}
        </div>
      ))}
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////   CHATBOX  /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
const ChatBox = ({ userId, userName, currentThread, update }) => {
  const [text, setText] = useState('');
  const submit = () => {
    let message = {
      userId: currentThread,
      message: text,
      sender: userId,
      name: userName,
    };
    axios
      .post('/api/message/', message)
      .then(({ data }) => {
        update(data);
        setText('');
      })
      .catch((err) => console.log('chatbox err: ', err));
  };
  return (
    <div className='chat-box'>
      <input
        onChange={(e) => setText(e.target.value)}
        type='text'
        value={text}
      />
      <button onClick={submit}>submit</button>
    </div>
  );
};
export default Messages;
