import React from 'react';
import { dateFromDateAndTime } from '../../../../util/util';
import { v4 as uuidv4 } from 'uuid';
import Day from './parts/Day';

const MobileSchedule = ({
  props: { days, week, displayBlocks, setDisplayBlocks, setActualBlocks },
}) => {
  const handleSubmitTime = ({ timeSelection: { start, end }, day }) => {
    const selectedDate = week[days.indexOf(day)];
    const startTime = `${start.hour}:${start.minute} ${start.amOrPm}`;
    const endTime = `${end.hour}:${end.minute} ${end.amOrPm}`;
    const startDate = dateFromDateAndTime(selectedDate, startTime);
    const endDate = dateFromDateAndTime(selectedDate, endTime);

    if (startDate.getTime() > endDate.getTime())
      return console.log('error: start time cannot be after end time');

    const newBlock = {
      startDate,
      endDate,
      start: startTime,
      end: endTime,
      day,
      title: '',
      recurring: false,
      id: uuidv4(),
    };

    setDisplayBlocks((displayBlocks) => [...displayBlocks, newBlock]);
    setActualBlocks((actualBlocks) => [...actualBlocks, newBlock]);
  };

  return (
    <div className='mb-schedule'>
      <h3 className='title'>schedule</h3>
      {days.map((day, i) => {
        const currentDate = new Date(week[i]);
        return (
          <Day
            props={{ currentDate, day, displayBlocks, handleSubmitTime }}
            key={day}
          />
        );
      })}
    </div>
  );
};

export default MobileSchedule;
