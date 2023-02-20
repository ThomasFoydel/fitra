import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import React, { useContext } from 'react'
import { CTX } from 'context/Store'
import './Settings.scss'

const Settings = () => {
  const [{ user, settings }, updateState] = useContext(CTX)
  const { darkmode } = settings
  const { type, token } = user

  const handleDarkMode = ({ target: { checked } }) => {
    axios
      .put(
        `/api/user/settings/${type}/darkmode`,
        { checked: !checked },
        { headers: { 'x-auth-token': token } }
      )
      .then(({ data: { settings } }) => {
        updateState({
          type: 'CHANGE_SETTINGS',
          payload: { type: 'darkmode', value: settings.darkmode },
        })
      })
      .catch(({ response: { data } }) => toast.error(data.message))
  }

  return (
    <div className={`settings dm-${darkmode}`}>
      <h2 className="header center">Settings</h2>
      <div className="form">
        <div className="setting-item">
          <span>darkmode</span>
          <label className="switch darkmode-switch" htmlFor="darkmode">
            <input
              id="darkmode"
              type="checkbox"
              checked={darkmode}
              onChange={handleDarkMode}
              data-testid="darkmode-btn"
            />
            <span className="slider round" />
          </label>
        </div>
        <div className="setting-item">
          <Link to="/terms-of-use">terms of use</Link>
        </div>
        <div className="setting-item">
          <Link to="/privacy-policy">privacy policy</Link>
        </div>
        <div className="setting-item">
          <Link className="delete-btn" to="/delete_my_account">
            delete my account
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Settings
