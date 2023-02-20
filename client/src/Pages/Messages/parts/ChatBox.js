import axios from 'axios'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import React, { useState } from 'react'

const ChatBox = ({ props: { userId, userName, currentThread, update, isTrainer } }) => {
  const [text, setText] = useState('')

  const submit = (e) => {
    e.preventDefault()
    if (!text) return toast.error('Message must contain content')

    const message = {
      message: text,
      name: userName,
      sender: userId,
      userId: currentThread,
      fromTrainer: isTrainer,
    }

    axios
      .post('/api/message/', message)
      .then(({ data: { newMessage } }) => {
        update(newMessage)
        setText('')
      })
      .catch(({ response: { data } }) => toast.error(data.message))
  }

  return (
    <form onSubmit={submit}>
      <input type="text" value={text} className="input" onChange={(e) => setText(e.target.value)} />
      <button type="submit">send</button>
    </form>
  )
}

ChatBox.propTypes = {
  props: PropTypes.shape({
    userId: PropTypes.string,
    userName: PropTypes.string,
    currentThread: PropTypes.string,
    update: PropTypes.func.isRequired,
    isTrainer: PropTypes.bool.isRequired,
  }),
}

export default ChatBox
