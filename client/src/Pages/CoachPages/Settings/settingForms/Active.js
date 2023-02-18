import React from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'

const Active = ({ props: { type, onComplete, token, active } }) => {
  const handleActive = async ({ target: { checked } }) => {
    axios
      .put(
        `/api/user/settings/${type}/active`,
        { value: checked },
        { headers: { 'x-auth-token': token } }
      )
      .then(({ data: { settings } }) => onComplete({ type: 'active', value: settings.active }))
      .catch(({ data: { message } }) => toast.error(message))
  }

  return (
    <div className="active">
      <h3>Active</h3>
      <label className="switch" htmlFor="active">
        <input
          id="active"
          type="checkbox"
          onChange={handleActive}
          data-testid="active-btn"
          checked={active || false}
        />
        <span className="slider round"></span>
      </label>
    </div>
  )
}

export default Active
