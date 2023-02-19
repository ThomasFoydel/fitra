import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import React, { useState, useContext } from 'react'
import { CTX } from 'context/Store'
import './Delete.scss'

const Delete = () => {
  const [inputVal, setInputVal] = useState('')
  const [{ user }, updateState] = useContext(CTX)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [secondConfirm, setSecondConfirm] = useState(false)
  const { type, token } = user

  const handleDelete = () => {
    axios
      .delete(`/api/user/delete_my_account/${type}`, {
        headers: { 'x-auth-token': token, pass: inputVal },
      })
      .then(() => updateState({ type: 'LOGOUT' }))
      .catch(({ response: { data } }) => toast.error(data.message))
  }

  const handleInput = ({ target: { value } }) => setInputVal(value)

  return (
    <>
      <div className="background" />
      <div className="overlay" />
      <div className="delete-page">
        <h2>delete my account</h2>

        {secondConfirm ? (
          <div className="flexcol">
            <input
              type="password"
              value={inputVal}
              placeholder="password"
              onChange={handleInput}
              data-testid="delete-password-input"
            />
            <div className="btns">
              <button
                onClick={() => {
                  setOpenConfirm(false)
                  setSecondConfirm(false)
                }}
                className="cancel-btn"
              >
                nevermind
              </button>
              <button onClick={handleDelete} className="delete-btn">
                DELETE
              </button>
            </div>
          </div>
        ) : openConfirm ? (
          <div className="flexcol">
            <h3>You sure? This cannot be undone.</h3>
            <div className="btns">
              <button onClick={() => setOpenConfirm(false)} className="cancel-btn">
                No
              </button>
              <button onClick={() => setSecondConfirm(true)} className="delete-btn">
                Yes
              </button>
            </div>
          </div>
        ) : (
          <>
            <h3>WARNING! THIS IS PERMANENT!</h3>
            <button onClick={() => setOpenConfirm(true)} className="delete-btn">
              delete my account
            </button>
          </>
        )}
        <Link className="close-btn" to={`${type === 'trainer' ? '/coachportal' : ''}/settings`}>
          <i className="fas fa-times fa-3x" />
        </Link>
      </div>
    </>
  )
}

export default Delete
