import axios from 'axios'
import React, { useState } from 'react'
import { toast } from 'react-toastify'

const RateEditor = ({ props: { rate, onComplete, token } }) => {
  const [input, setInput] = useState(rate || 0)

  const handleSubmit = () => {
    axios
      .put(
        '/api/user/settings/trainer/rate/',
        { value: Number(input) },
        { headers: { 'x-auth-token': token } }
      )
      .then(({ data: { settings } }) => onComplete({ type: 'rate', value: settings.rate }))
      .catch(({ data: { response } }) => toast.error(response.message))
  }

  return (
    <div className="rate-editor">
      {rate ? (
        <div>
          <h3>Current Rate:</h3> <span data-testid="rate-display">${rate}</span>
        </div>
      ) : (
        <div>rate not set</div>
      )}
      <input
        value={input}
        type="number"
        className="input"
        placeholder="rate"
        data-testid="rate-editor-input"
        onChange={({ target: { value } }) => setInput(value)}
      />
      <button onClick={handleSubmit} data-testid="rate-editor-btn">
        update
      </button>
    </div>
  )
}

export default RateEditor
