import React from 'react';
import Schedule from './Schedule';

const ScheduleContainer = () => {
  const handleChange = (e) => {
    console.log({ e });
  };
  return (
    <div className='schedule-container'>
      <Schedule entries={exampleEntries} change={handleChange} />
    </div>
  );
};

const exampleEntries = [
  {
    start: '12:00 AM',
    end: '1:30 AM',
    day: 'Sunday',
    title: 'bjj',
    id: 1,
    recurring: false,
    startDate: new Date('2020', '08', '20', '00', '00'),
    endDate: new Date('2020', '08', '20', '01', '30'),
  },
  {
    start: '12:00 AM',
    end: '1:30 AM',
    day: 'Monday',
    title: 'bjj',
    id: 2,
    recurring: false,
    startDate: new Date('2020', '08', '14', '00', '00'),
    endDate: new Date('2020', '08', '14', '01', '30'),
  },
];

export default ScheduleContainer;
