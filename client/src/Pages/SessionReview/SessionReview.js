import axios from 'axios'
import { toast } from 'react-toastify'
import React, { useState, useContext } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { CTX } from 'context/Store'
import './SessionReview.scss'

const SessionReview = () => {
  const { sessionId } = useParams()
  const [appState] = useContext(CTX)
  const [formData, setFormData] = useState({ rating: -1, comment: '' })
  const { rating, comment } = formData
  const [redirect, setRedirect] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleChange = ({ target: { id, value } }) => {
    setFormData((form) => ({ ...form, [id]: value }))
  }

  const submit = () => {
    if (rating < 0) return toast.error('Must select a rating')
    if (comment.length < 20) return toast.error('Comment must be at least 20 characters')
    axios
      .post(`/api/client/review/${sessionId}`, formData, {
        headers: { 'x-auth-token': appState.user.token },
      })
      .then(() => setRedirect(true))
      .catch(({ data: { message } }) => toast.error(message))
  }

  return (
    <div className="session-review-page">
      <div className="background" />
      <div className="overlay" />
      <div className="session-review">
        {redirect && <Navigate to="/" />}
        <h2>Session Review</h2>
        <select data-testid="select" onChange={handleChange} value={rating} id="rating">
          <option value={-1}>--</option>
          <option value={4}>perfect</option>
          <option value={3}>great</option>
          <option value={2}>good</option>
          <option value={1}>ok</option>
          <option value={0}>bad</option>
        </select>
        <textarea
          onChange={handleChange}
          value={comment}
          id="comment"
          cols="30"
          rows="10"
          placeholder="Leave your comments here..."
        />
        {confirmOpen ? (
          <div className="confirm-btns">
            <button onClick={() => setConfirmOpen(false)}>cancel</button>
            <button onClick={submit}>confirm</button>
          </div>
        ) : (
          <button onClick={() => setConfirmOpen(true)}>submit</button>
        )}
      </div>
    </div>
  )
}

export default SessionReview
