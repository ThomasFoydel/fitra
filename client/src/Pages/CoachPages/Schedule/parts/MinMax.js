import React from 'react';

const MinMax = ({ props: { handleMinMax, min, max } }) => {
  return (
    <div className='min-and-max'>
      <div className='min-max'>
        <h4>min</h4>
        <select onChange={handleMinMax} value={min} id='minimum'>
          <option value={1}>30 minutes</option>
          <option value={2}>1 hour</option>
          <option value={3}>1.5 hours</option>
          <option value={4}>2 hours</option>
        </select>
        <h4>max</h4>
        <select onChange={handleMinMax} value={max} id='maximum'>
          <option value={1}>30 minutes</option>
          <option value={2}>1 hour</option>
          <option value={3}>1.5 hours</option>
          <option value={4}>2 hours</option>
        </select>
      </div>
    </div>
  );
};

export default MinMax;
