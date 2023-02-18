import axios from 'axios'
import { toast } from 'react-toastify'
import { act } from '@testing-library/react'
import { config, animated, useTransition } from 'react-spring'
import React, { useContext, useEffect, useState } from 'react'
import { CTX } from 'context/Store'
import Session from './Session'
import './TrainerHome.scss'

const TrainerHome = () => {
  const [{ user }] = useContext(CTX)
  const { type, token } = user
  const [foundSessions, setFoundSessions] = useState([])

  useEffect(() => {
    let subscribed = true
    axios
      .get(`/api/${type}/dashboard`, { headers: { 'x-auth-token': token } })
      .then(({ data: { sessions } }) => {
        if (subscribed) act(() => setFoundSessions(sessions))
      })
      .catch(({ data: { response } }) => toast.error(response.message))
    return () => (subscribed = false)
  }, [token, type])

  const animatedSessions = useTransition(foundSessions, {
    trail: 200,
    config: config.wobbly,
    from: { opacity: '0', transform: 'translateY(-20px)' },
    enter: { opacity: '1', transform: 'translateY(0px)' },
    leave: { opacity: '0', transform: 'translateY(-20px)' },
  })

  return (
    <>
      <div className="background" />
      <div className="overlay" />
      <div className="trainer-home">
        <h2>Sessions</h2>
        <div className="sessions">
          {foundSessions.length > 0 ? (
            animatedSessions.map((props, item, key) => (
              <animated.div style={props} key={key}>
                <Session session={item} />
              </animated.div>
            ))
          ) : (
            <h3>no recent or upcoming sessions</h3>
          )}
        </div>
      </div>
    </>
  )
}

export default TrainerHome
