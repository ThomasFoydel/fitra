import { useSpring, config, animated } from 'react-spring'
import React, { useContext, useEffect, useState, useRef } from 'react'
import ThreadListItem from './parts/ThreadListItem'
import ChatBox from './parts/ChatBox'
import Thread from './parts/Thread'
import { CTX } from 'context/Store'
import './Messages.scss'

const Messages = () => {
  const [{ messages, user }, updateState] = useContext(CTX)
  const { token, id, name, type } = user
  const [currentThread, setCurrentThread] = useState(null)

  const newMessage = (message) => updateState({ type: 'NEW_MESSAGE', payload: { message } })

  const scrollRef = useRef()

  const refEl = () => <div ref={scrollRef} />

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messages, currentThread])

  const messageKeys = Object.keys(messages)

  const animation = useSpring({
    config: config.smooth,
    opacity: currentThread ? 1 : 0,
    display: currentThread ? 'inherit' : 'none',
  })

  return (
    <div className="messages">
      <div className="thread-section">
        {messageKeys.length === 0 && <div className="no-msg">no messages</div>}
        <div className="thread-list">
          {messageKeys.map((key) => (
            <ThreadListItem
              key={key}
              user={key}
              token={token}
              currentThread={currentThread}
              setCurrentThread={setCurrentThread}
            />
          ))}
        </div>
        <div className="current-thread">
          {currentThread && (
            <Thread
              props={{
                refEl,
                currentUser: id,
                thread: messages[currentThread],
                close: () => setCurrentThread(null),
              }}
            />
          )}
        </div>
      </div>

      <animated.div style={animation} className="chat-box">
        <ChatBox
          props={{
            userId: id,
            currentThread,
            userName: name,
            update: newMessage,
            isTrainer: type === 'trainer',
          }}
        />
      </animated.div>
    </div>
  )
}

export default Messages
