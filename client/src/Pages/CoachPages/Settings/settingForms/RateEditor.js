import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const RateEditor = ({ props: { rate, onComplete, token } }) => {
  const [input, setInput] = useState(rate || 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .put(
        '/api/user/settings/trainer/rate/',
        { value: Number(input) },
        { headers: { 'x-auth-token': token } }
      )
      .then(({ data: { settings } }) => onComplete({ type: 'rate', value: settings.rate }))
      .catch(({ response: { data } }) => toast.error(data.message))
  }

  return (
    <form className="rate-editor" onSubmit={handleSubmit}>
      {rate ? (
        <div>
          <h3>Current Rate:</h3> <span data-testid="rate-display">${rate}</span>
        </div>
      ) : (
        <div>rate not set</div>
      )}
      <input
        min={1}
        value={input}
        type="number"
        className="input"
        placeholder="rate"
        data-testid="rate-editor-input"
        onChange={({ target: { value } }) => setInput(value)}
      />
      <button type="submit" data-testid="rate-editor-btn">
        update
      </button>
    </form>
  )
}

export default RateEditor
