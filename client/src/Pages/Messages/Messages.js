import React, { useContext, useEffect, useState } from 'react';
import './Messages.scss';
import axios from 'axios';
import { CTX } from 'context/Store';

const Messages = () => {
  const [appState, updateState] = useContext(CTX);
  let { messages } = appState;
  let { token, id, name } = appState.user;
  const [currentThread, setCurrentThread] = useState(null);

  // useEffect(() => {
  //   axios.get(`/api/${appState.user.type}/messages`);
  // }, []);

  const newMessage = (message) => {
    updateState({ type: 'NEW_MESSAGE', payload: { message } });
  };

  return (
    <div className='messages'>
      <div className='background'></div>
      <div className='thread-section'>
        <div className='thread-list'>
          {Object.keys(messages).map((key) => (
            <ThreadListItem
              user={key}
              key={key}
              setCurrentThread={setCurrentThread}
              currentThread={currentThread}
              token={token}
            />
          ))}
        </div>
        <div className='current-thread'>
          {currentThread && (
            <Thread
              currentUser={appState.user.id}
              thread={messages[currentThread]}
              close={() => setCurrentThread(null)}
            />
          )}
        </div>
      </div>

      {currentThread && (
        <div className='chat-box'>
          <ChatBox
            userId={id}
            userName={name}
            currentThread={currentThread}
            update={newMessage}
          />
        </div>
      )}
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
      className={`threadlistitem ${current && 'current-item'}`}
      onClick={() =>
        setCurrentThread((cUser) => (cUser === user ? null : user))
      }
    >
      <img
        className='profile-pic'
        // src={`/api/image/${userInfo.profilePic}`}
        src={`/api/image/user/profilePic/${user}`}
        alt={`profile of ${userInfo.name}`}
      />
      <span className='name'>{userInfo.name}</span>
      {/* {!current && <button onClick={() => setCurrentThread(user)}>open</button>} */}
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////   THREAD   /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
const Thread = ({ thread, close, currentUser }) => {
  return (
    <div className='thread'>
      {/* <button onClick={close} className='close-btn'>
        <i className='fa fa-times' aria-hidden='true'></i>
      </button> */}
      {thread.map((msg) => {
        let ownMessage = msg.sender === currentUser;
        return (
          <div className={`message ownmsg-${ownMessage}`} key={msg._id}>
            {!ownMessage && (
              <>
                <img
                  className='profile-pic'
                  src={`/api/image/user/profilePic/${msg.sender}`}
                ></img>
                <strong className='name'>{msg.authorName}</strong>
              </>
            )}
            <p className='content'>{msg.content}</p>
          </div>
        );
      })}
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
export default Messages;
