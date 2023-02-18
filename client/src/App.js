import axios from 'axios'
import io from 'socket.io-client'
import React, { useEffect, useContext, useRef } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import TrainerLandingPage from 'Pages/CoachPages/TrainerLandingPage/TrainerLandingPage'
import TrainerSchedule from 'Pages/CoachPages/Schedule/ScheduleContainer'
import ManageSession from 'Pages/CoachPages/ManageSession/ManageSession'
import TrainerHome from 'Pages/CoachPages/TrainerHome/TrainerHome'
import TrainerProfile from 'Pages/TrainerProfile/TrainerProfile'
import TrainerSettings from 'Pages/CoachPages/Settings/Settings'
import SessionReview from 'Pages/SessionReview/SessionReview'
import ClientProfile from 'Pages/ClientProfile/ClientProfile'
import PrivacyPolicy from 'Pages/PrivacyPolicy/PrivacyPolicy'
import LandingPage from 'Pages/LandingPage/LandingPage'
import EditProfile from 'Pages/EditProfile/EditProfile'
import TermsOfUse from 'Pages/TermsOfUse/TermsOfUse'
import Settings from 'Pages/Settings/Settings'
import Trainers from 'Pages/Trainers/Trainers'
import Messages from 'Pages/Messages/Messages'
import NavBar from 'Components/NavBar/NavBar'
import Connect from 'Pages/Connect/Connect'
import Delete from 'Pages/Delete/Delete'
import Auth from 'Components/Auth/Auth'
import { CTX } from 'context/Store'
import Home from 'Pages/Home/Home'
import './App.scss'

function App() {
  const [{ isLoggedIn, user, showAuth }, updateState] = useContext(CTX)
  const { token, type } = user

  const socketRef = useRef(null)

  useEffect(() => {
    let subscribed = true
    const tokenLS = localStorage.getItem('fitr-token')

    const checkAuth = async () => {
      axios
        .get('/api/auth/', {
          headers: { 'x-auth-token': tokenLS },
        })
        .then(({ data: { user } }) => {
          if (subscribed && user) updateState({ type: 'LOGIN', payload: { user, token: tokenLS } })
        })
        .catch(() => {
          if (process.env.NODE_ENV === 'production') updateState({ type: 'LOGOUT' })
        })
    }

    const noToken = !tokenLS || tokenLS === 'undefined'

    noToken ? updateState({ type: 'LOGOUT' }) : checkAuth()

    return () => {
      if (socketRef.current) socketRef.current.emit('disconnect-room', socketRef.current.id)
      subscribed = false
    }
  }, [updateState])

  useEffect(() => {
    let subscribed = true

    if (token) {
      const urlBase = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:8000/'
      const ENDPOINT = urlBase + `?token=${token}`

      socketRef.current = io(ENDPOINT, { transports: ['websocket', 'polling', 'flashsocket'] })

      if (subscribed) {
        socketRef.current.on('chat-message', (message) =>
          updateState({ type: 'NEW_MESSAGE', payload: { message } })
        )
      }
    }

    return () => {
      subscribed = false
      if (socketRef.current) {
        socketRef.current.removeAllListeners()
        socketRef.current.off()
      }
    }
  }, [token, updateState])

  const HomeComponent = type === 'trainer' ? TrainerHome : Home

  return (
    <div className={`App`}>
      <Router>
        <NavBar />
        <Routes>
          <Route exact path="/" element={isLoggedIn ? <HomeComponent /> : <LandingPage />} />

          <Route
            exact
            path="/coachportal"
            element={isLoggedIn ? <HomeComponent /> : <TrainerLandingPage />}
          />

          <Route exact path="/terms-of-use" element={<TermsOfUse />} />
          <Route exact path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route exact path="/trainers" element={<Trainers />} />
          <Route exact path="/trainer/:trainerId" element={<TrainerProfile />} />
          <Route exact path="/settings" element={isLoggedIn ? <Settings /> : <LandingPage />} />
          <Route
            exact
            path="/editprofile"
            element={isLoggedIn ? <EditProfile /> : <LandingPage />}
          />

          <Route
            exact
            path="/review/:sessionId"
            element={isLoggedIn ? <SessionReview /> : <LandingPage />}
          />

          <Route
            exact
            path="/connect/:connectionId"
            element={({ match }) =>
              match && socketRef.current ? (
                <Connect socket={socketRef.current} match={match} />
              ) : (
                <HomeComponent />
              )
            }
          />
          <Route exact path="/messages" element={isLoggedIn ? <Messages /> : <LandingPage />} />

          <Route exact path="/user/:id" element={<ClientProfile />} />
          <Route exact path="/delete_my_account" element={<Delete />} />

          <Route
            exact
            path="/coachportal/settings"
            element={isLoggedIn ? <TrainerSettings /> : <TrainerLandingPage />}
          />
          <Route
            exact
            path="/coachportal/editprofile"
            element={isLoggedIn ? <EditProfile /> : <TrainerLandingPage />}
          />
          <Route
            exact
            path="/coachportal/schedule"
            element={isLoggedIn ? <TrainerSchedule /> : <TrainerLandingPage />}
          />

          <Route
            exact
            path="/coachportal/messages"
            element={isLoggedIn ? <Messages /> : <TrainerLandingPage />}
          />
          <Route
            exact
            path="/coachportal/manage/:id"
            element={({ match }) =>
              isLoggedIn ? <ManageSession match={match} /> : <TrainerLandingPage />
            }
          />
        </Routes>

        {!isLoggedIn && showAuth && <Auth trainer={false} />}
      </Router>
    </div>
  )
}

export default App
