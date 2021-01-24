import React, { useContext, useEffect, useState, useRef } from 'react';
import { useSpring, config, animated } from 'react-spring';
import ThreadListItem from './parts/ThreadListItem';
import Thread from './parts/Thread';
import ChatBox from './parts/ChatBox';
import { CTX } from 'context/Store';
import './Messages.scss';

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

  const animation = useSpring({
    opacity: currentThread ? 1 : 0,
    display: currentThread ? 'inherit' : 'none',
    config: config.smooth,
  });

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
              props={{
                currentUser: appState.user.id,
                thread: messages[currentThread],
                refEl,
                close: () => setCurrentThread(null),
              }}
            />
          )}
        </div>
      </div>

      <animated.div style={animation} className='chat-box'>
        <ChatBox
          props={{
            isTrainer: type === 'trainer',
            userId: id,
            userName: name,
            currentThread,
            update: newMessage,
          }}
        />
      </animated.div>
    </div>
  );
};

export default Messages;
