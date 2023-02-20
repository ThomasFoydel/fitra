import axios from 'axios'
import React, { useState, useEffect, useContext } from 'react'
import { CTX } from 'context/Store'
import './IntroMessage.scss'

const IntroMessage = ({ id, toggle }) => {
  const [{ user }, updateState] = useContext(CTX)
  const [complete, setComplete] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = ({ target: { value } }) => setMessage(value)

  const handleSubmit = (e) => {
    e.preventDefault()
    const valid = id && message && user.id && user.name
    if (!valid) return

    const newMsg = {
      message,
      userId: id,
      name: user.name,
      sender: user.id,
      fromTrainer: user.type === 'trainer',
    }

    axios.post('/api/message', newMsg).then(({ data: { newMessage } }) => {
      updateState({ type: 'NEW_MESSAGE', payload: { message: newMessage } })
      setComplete(true)
    })
  }

  useEffect(() => {
    let subscribed = true
    if (complete) setTimeout(() => subscribed && toggle(), 2000)
    return () => (subscribed = false)
  }, [complete, toggle])

  return (
    <form className="intro-message" onSubmit={handleSubmit}>
      <h2>intro message</h2>
      <textarea
        rows="10"
        cols="30"
        id="message"
        name="message"
        value={message}
        onChange={handleChange}
      />
      {complete && <p>message sent!</p>}
      <button type="submit">send</button>
    </form>
  )
}

export default IntroMessage
