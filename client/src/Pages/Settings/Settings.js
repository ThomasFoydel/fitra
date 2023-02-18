import axios from 'axios'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import React, { useContext } from 'react'
import { CTX } from 'context/Store'
import './Settings.scss'

const Settings = () => {
  const [appState, updateState] = useContext(CTX)
  const { type, token } = appState.user
  const { darkmode } = appState.settings

  const handleDarkMode = ({ target: { checked } }) => {
    axios
      .post(
        `/api/user/settings/${type}/darkmode`,
        { checked },
        { headers: { 'x-auth-token': token } }
      )
      .then(({ data: { settings } }) => {
        updateState({
          type: 'CHANGE_SETTINGS',
          payload: { type: 'darkmode', value: settings.darkmode },
        })
      })
      .catch(({ data: { response } }) => toast.error(response.message))
  }

  return (
    <>
      <div className="background" />
      <div className="overlay" />
      <div className={`settings dm-${darkmode}`}>
        <h2 className="header center">Settings</h2>
        <div className="form">
          <div className="setting-item">
            <span>darkmode</span>
            <label className="switch" htmlFor="darkmode">
              <input
                data-testid="darkmode-btn"
                checked={darkmode}
                type="checkbox"
                onChange={handleDarkMode}
                id="darkmode"
              />
              <span className="slider round"></span>
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
    </>
  )
}

export default Settings
