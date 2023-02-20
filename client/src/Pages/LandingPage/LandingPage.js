import React from 'react'
import { Link } from 'react-router-dom'
import './LandingPage.scss'

const LandingPage = () => (
  <div className="landing-page">
    <h2 className="landing-title">
      SHARPEN
      <br />
      YOUR BODY
    </h2>

    <Link to="/trainers" className="trainers-link">
      Get Started
    </Link>

    <Link to="/coachportal" className="coachportal-btn">
      Coach Portal
    </Link>
  </div>
)

export default LandingPage
