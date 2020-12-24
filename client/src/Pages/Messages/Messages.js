import React, { useContext, useEffect, useState, useRef } from 'react';
import './Messages.scss';
import { CTX } from 'context/Store';

import ThreadListItem from './parts/ThreadListItem';
import Thread from './parts/Thread';
import ChatBox from './parts/ChatBox';
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

export default Messages;
