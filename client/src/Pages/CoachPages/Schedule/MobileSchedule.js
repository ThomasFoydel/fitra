import React, { useState } from 'react';

const MobileSchedule = ({
  props: {
    halfHours,
    days,
    dayOfWeek,
    week,
    blockedTimes,
    setBlockedTimes,
    entries,
    blockEntries,
    setBlockEntries,
  },
}) => {
  // blockedTimes = render, blockEntries = db
  const [dayOpen, setDayOpen] = useState(0);

  return (
    <div className='mobileschedule'>
      {days.map((day) => (
        <div className='day'>
          <h1>{day}</h1>
          {Object.keys(blockedTimes).map((key) => {
            let time = blockedTimes[key];

            let date = new Date(time.startDate);
            console.log({ time, date });
            return (
              <div key={time._id}>
                <h1>blockedTime</h1>
                <p>{date.start}</p>
                <p>{date.toDateString()}</p>
              </div>
            );
          })}
        </div>
      ))}
      {/* <h1>{days.join(' ')}</h1> */}
    </div>
  );
};

export default MobileSchedule;
