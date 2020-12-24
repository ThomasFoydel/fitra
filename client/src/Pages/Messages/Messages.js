import React, { useContext, useEffect, useState, useRef } from 'react';
import './Messages.scss';
import axios from 'axios';
import { CTX } from 'context/Store';
import { Link } from 'react-router-dom';
import Image from 'Components/Image/Image';

const Messages = () => {
  const [appState, updateState] = useContext(CTX);
  let { messages } = appState;
  let { token, id, name, type } = appState.user;
  const [currentThread, setCurrentThread] = useState(null);

  const newMessage = (message) => {
    updateState({ type: 'NEW_MESSAGE', payload: { message } });
  };

  const scrollRef = useRef();

  const refEl = () => <div ref={scrollRef} />;

  useEffect(() => {
    if (scrollRef.current)
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [messages, currentThread]);
  let messageKeys = Object.keys(messages);
  return (
    <div className='messages'>
      <div className='background' />
      <div className='overlay' />
      <div className='thread-section'>
        {messageKeys.length === 0 && <div className='no-msg'>no messages</div>}
        <div className='thread-list'>
          {messageKeys.map((key) => (
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
              refEl={refEl}
              close={() => setCurrentThread(null)}
            />
          )}
        </div>
      </div>

      {currentThread && (
        <div className='chat-box'>
          <ChatBox
            isTrainer={type === 'trainer'}
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
  }, [token, user]);

  let current = currentThread === user;

  return (
    <div
      className={`threadlistitem ${current && 'current-item'}`}
      onClick={() =>
        setCurrentThread((cUser) => (cUser === user ? null : user))
      }
    >
      <Image
        name='profile-pic'
        src={`/api/image/user/profilePic/${user}`}
        alt={`profile of ${userInfo.name}`}
      />
      {userInfo.name && (
        <span className='name'>{userInfo.name.split(' ')[0]}</span>
      )}
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////   THREAD   /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
const Thread = ({ thread, close, currentUser, refEl }) => {
  return (
    <div className='thread'>
      {thread.map((msg) => {
        let ownMessage = msg.sender === currentUser;
        return (
          <div className={`message ownmsg-${ownMessage}`} key={msg._id}>
            {!ownMessage && (
              <>
                <Link
                  to={`/${msg.fromTrainer ? 'trainer' : 'user'}/${msg.sender}`}
                >
                  <Image
                    alt="sender's profile"
                    name='profile-pic'
                    src={`/api/image/user/profilePic/${msg.sender}`}
                  />
                </Link>
                <strong className='name'>{msg.authorName.split(' ')[0]}</strong>
              </>
            )}
            <p className='content'>{msg.content}</p>
          </div>
        );
      })}
      {refEl()}
    </div>
  );
};

////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////   CHATBOX  /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////
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
export default Messages;
