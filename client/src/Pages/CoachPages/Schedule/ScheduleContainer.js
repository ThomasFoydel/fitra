import React, { useState, useEffect, useContext, useRef } from 'react';
import Schedule from './Schedule';
import axios from 'axios';
import { CTX } from 'context/Store';
import { getHalfHourFromDate, days } from '../../../util/util';
import { act } from '@testing-library/react';

const ScheduleContainer = () => {
  const [appState] = useContext(CTX);
  let { token } = appState.user;
  const [entries, setEntries] = useState(null);
  const [sessions, setSessions] = useState(null);
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(3);
  const [err, setErr] = useState('');

  const handleChange = (e) => {
    axios
      .post('/api/trainer/schedule/', e, {
        headers: { 'x-auth-token': token },
      })
      .then(({ data }) => setEntries(data))
      .catch((err) => console.log({ err }));
  };

  useEffect(() => {
    let subscribed = true;
    axios
      .get('/api/trainer/schedule/', { headers: { 'x-auth-token': token } })
      .then(({ data: { entries, min, max, foundSessions } }) => {
        if (foundSessions) {
          let sessions = [];
          foundSessions.forEach(({ client, startTime, endTime, _id }) => {
            if (typeof startTime === 'string') startTime = new Date(startTime);
            let day = days[startTime.getDay()];
            let startHour = getHalfHourFromDate(startTime);
            let endHour = getHalfHourFromDate(endTime);
            let newSession = {
              startDate: startTime,
              endDate: endTime,
              start: startHour,
              end: endHour,
              day,
              title: '',
              recurring: false,
              id: _id,
              session: true,
              client,
            };
            sessions.push(newSession);
          });
          if (process.env.NODE_ENV === 'production') {
            setSessions(sessions);
          } else {
            act(() => setSessions(sessions));
          }
        }
        if (subscribed) {
          if (process.env.NODE_ENV === 'production') {
            setEntries(entries);
            setMin(min);
            setMax(max);
          } else {
            act(() => {
              setEntries(entries);
              setMin(min);
              setMax(max);
            });
          }
        }
      });
    return () => (subscribed = false);
  }, [token]);

  const handleMinMax = ({ target: { value, id } }) => {
    value = Number(value);
    if (id === 'maximum' && value < min)
      return setErr('maximum must be greater than minimum');
    if (id === 'minimum' && value > max)
      return setErr('minimum cannot be greater than maximum');
    axios
      .post(
        `/api/trainer/minmax/${id}/`,
        { value },
        {
          headers: { 'x-auth-token': token },
        }
      )
      .then(({ data: { min, max, err } }) => {
        if (err) return setErr(err);
        setMin(min);
        setMax(max);
      })
      .catch((err) => console.log({ err }));
  };

  const didMountRef = useRef(false);
  useEffect(() => {
    let subscribed = true;
    if (didMountRef.current) {
      setTimeout(() => {
        if (subscribed) setErr('');
      }, 2700);
    } else didMountRef.current = true;
    return () => (subscribed = false);
  }, [err]);

  return (
    <div className='schedule-container'>
      {entries && (
        <Schedule
          props={{
            min,
            handleMinMax,
            max,
            change: handleChange,
            entries,
            err,
            sessions,
            setSessions,
          }}
        />
      )}
    </div>
  );
};

export default ScheduleContainer;
