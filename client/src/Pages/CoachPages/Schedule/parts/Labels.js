import React from 'react';

const Labels = ({ props: { week, weekShift, today } }) => {
  return (
    <div className='labels'>
      {Object.keys(week).map((key, i) => {
        const day = week[key];
        const dateString = day
          .toDateString()
          .substring(0, day.toDateString().length - 5);
        return (
          <div
            className={`day-label today-${today === i && weekShift === 0}`}
            key={key}
          >
            {dateString}
          </div>
        );
      })}
    </div>
  );
};

export default Labels;
