import { Link } from 'react-router-dom'
import React, { useContext } from 'react'
import TagEditor from './settingForms/TagEditor'
import RateEditor from './settingForms/RateEditor'
import Active from './settingForms/Active'
import { CTX } from 'context/Store'
import './Settings.scss'

const Settings = () => {
  const [{ user, settings }, updateState] = useContext(CTX) || []
  const { rate, active } = settings || {}
  const { type, token } = user || {}

  const onComplete = ({ type, value }) => {
    updateState({ type: 'CHANGE_SETTINGS', payload: { type, value } })
  }

  return (
    <>
      <div className="background" />
      <div className="overlay" />
      <div className={`trainer-settings `}>
        <h2 className="header center">Settings</h2>

        <div className="form">
          <div className="setting-item">
            <Active props={{ type, onComplete, token, active }} />
          </div>
          <div className="setting-item">
            <TagEditor />
          </div>

          <div className="setting-item">
            <RateEditor props={{ rate, onComplete, token }} />
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
