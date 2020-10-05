import React, { useState, useEffect, useContext } from 'react';
import Schedule from './Schedule';
import axios from 'axios';
import { CTX } from 'context/Store';

const ScheduleContainer = () => {
  const [appState, updateState] = useContext(CTX);
  let { token } = appState.user;
  const [entries, setEntries] = useState(null);

  const handleChange = (e) => {
    axios
      .post('/api/trainer/schedule/', e, {
        headers: { 'x-auth-token': token },
      })
      .then(({ data }) => setEntries(data))
      .catch((err) => console.log({ err }));
  };

  useEffect(() => {
    axios
      .get('/api/trainer/schedule/', { headers: { 'x-auth-token': token } })
      .then(({ data: { entries } }) => setEntries(entries));
  }, []);

  // useEffect(() => {
  //   console.log({ entries });
  // }, [entries]);
  return (
    <div className='schedule-container'>
      {entries && <Schedule entries={entries} change={handleChange} />}
    </div>
  );
};

const exampleEntries = [
  // {
  //   start: '12:00 AM',
  //   end: '1:30 AM',
  //   day: 'Sunday',
  //   title: 'bjj',
  //   id: 1,
  //   recurring: false,
  //   startDate: new Date('2020', '09', '5', '00', '00'),
  //   endDate: new Date('2020', '09', '5', '01', '30'),
  // },
  {
    start: '12:00 AM',
    end: '1:30 AM',
    day: 'Monday',
    title: 'bjj',
    id: 2,
    recurring: false,
    startDate: new Date('2020', '09', '4', '00', '00'),
    endDate: new Date('2020', '09', '4', '01', '30'),
  },
];

export default ScheduleContainer;
