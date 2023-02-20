import React, { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import yogatrainer from 'imgs/yogacoach.jpg'
import { CTX } from 'context/Store'
import './TrainerLandingPage.scss'

const TrainerLandingPage = () => {
  const [{ isLoggedIn }, updateState] = useContext(CTX)

  const openAuth = () => {
    updateState({ type: 'CHANGE_AUTH_PAGE', payload: { page: 'register' } })
    updateState({ type: 'CHANGE_AUTH_TYPE', payload: { type: 'trainer' } })
    updateState({ type: 'TOGGLE_AUTH' })
  }

  return (
    <div className="trainer-landingpage-background">
      <div className="trainer-landingpage">
        <div className="landing-background-image" />
        <img src={yogatrainer} alt="yoga coach" className="image" />
        <div className="overlay trainer-overlay" />
        <h2 className="heading">
          STREAMLINE
          <br />
          YOUR
          <br />
          WORKFLOW
          <button onClick={openAuth}>Get Started</button>
        </h2>
      </div>
      {isLoggedIn && <Navigate to="/coachportal/home" />}
    </div>
  )
}

export default TrainerLandingPage
