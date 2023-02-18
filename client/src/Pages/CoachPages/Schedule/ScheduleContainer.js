import axios from 'axios'
import { toast } from 'react-toastify'
import { act } from '@testing-library/react'
import React, { useState, useEffect, useContext } from 'react'
import { getHalfHourFromDate, days } from '../../../util/util'
import { CTX } from 'context/Store'
import Schedule from './Schedule'

const ScheduleContainer = () => {
  const [{ user }] = useContext(CTX)
  const { token } = user
  const [entries, setEntries] = useState(null)
  const [sessions, setSessions] = useState(null)
  const [min, setMin] = useState(1)
  const [max, setMax] = useState(3)

  const handleChange = (e) => {
    axios
      .put('/api/trainer/schedule/', e, { headers: { 'x-auth-token': token } })
      .then(({ data: { updatedSchedule } }) => setEntries(updatedSchedule))
      .catch(({ data }) => toast.error(data.message))
  }

  useEffect(() => {
    let subscribed = true
    axios
      .get('/api/trainer/schedule/', { headers: { 'x-auth-token': token } })
      .then(({ data: { entries, min, max, foundSessions } }) => {
        if (foundSessions) {
          const sessions = []
          foundSessions.forEach(({ client, startTime, endTime, _id }) => {
            if (typeof startTime === 'string') startTime = new Date(startTime)
            const day = days[startTime.getDay()]
            const startHour = getHalfHourFromDate(startTime)
            const endHour = getHalfHourFromDate(endTime)
            const newSession = {
              day,
              client,
              id: _id,
              title: '',
              end: endHour,
              session: true,
              start: startHour,
              endDate: endTime,
              recurring: false,
              startDate: startTime,
            }
            sessions.push(newSession)
          })
          if (!subscribed) return
          if (process.env.NODE_ENV === 'production') setSessions(sessions)
          else act(() => setSessions(sessions))
        }
        if (!subscribed) return
        if (process.env.NODE_ENV === 'production') {
          setEntries(entries)
          setMin(min)
          setMax(max)
        } else {
          act(() => {
            setEntries(entries)
            setMin(min)
            setMax(max)
          })
        }
      })
    return () => (subscribed = false)
  }, [token])

  const handleMinMax = ({ target: { value, id } }) => {
    value = Number(value)
    if (id === 'maximum' && value < min) {
      return toast.error('Maximum must be greater than minimum')
    }
    if (id === 'minimum' && value > max) {
      return toast.error('Minimum cannot be greater than maximum')
    }
    axios
      .put(`/api/trainer/minmax/${id}/`, { value }, { headers: { 'x-auth-token': token } })
      .then(({ data: { min, max } }) => {
        setMin(min)
        setMax(max)
      })
      .catch(({ data }) => toast.error(data.message))
  }

  return (
    <div className="schedule-container">
      {entries && (
        <Schedule
          props={{
            min,
            max,
            entries,
            sessions,
            setSessions,
            handleMinMax,
            change: handleChange,
          }}
        />
      )}
    </div>
  )
}

export default ScheduleContainer
