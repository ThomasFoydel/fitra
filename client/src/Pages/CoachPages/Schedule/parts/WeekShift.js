import React from 'react';

const WeekShift = ({ props: { handleWeekShift, weekShift } }) => {
  return (
    <div className='weekshift-btns'>
      <button
        onClick={() => handleWeekShift(weekShift - 1)}
        data-testid='back-btn'
      >
        <i className='far fa-arrow-alt-circle-left fa-4x' />
      </button>
      <button
        onClick={() => handleWeekShift(weekShift + 1)}
        data-testid='forward-btn'
      >
        <i className='far fa-arrow-alt-circle-right fa-4x' />
      </button>
    </div>
  );
};

export default WeekShift;
