import React, { useEffect, useState, useContext } from 'react';
// import { Link } from 'react-router-dom';
import axios from 'axios';
import { CTX } from 'context/Store';

import './Schedule.scss';

const Schedule = () => {
  const [
    {
      user: { token },
      isLoggedIn,
    },
    updateState,
  ] = useContext(CTX);
  const [schedule, setSchedule] = useState(arr1);
  const [unavails, setUnavails] = useState([]);
  const [blocksToChange, setBlocksToChange] = useState([]);

  useEffect(() => {
    let subscribed = true;
    // fetch current schedule and individual unavailable times
    axios
      .get('/api/trainer/schedule', { headers: { 'x-auth-token': token } })
      .then(({ data: { schedule, unavails } }) => {
        // console.log('schedule and unavails: ', schedule, unavails);
        // setSchedule(schedule);
        // setUnavails(unavails);
      });
    return () => (subscribed = false);
  }, []);
  const handleSubmit = () => {
    axios.post('/api/trainer/schedule', { schedule, unavails });
  };
  const handleChange = ({ day, time, block }) => {
    console.log(day, time, block);
    let newBlock = { time, block };
    setBlocksToChange({ ...blocksToChange, newBlock });
  };

  return (
    <div className='trainer-schedule'>
      <h2>schedule</h2>
      {/* <Link to='/editschedule'>edit schedule</Link> */}
      <h2>edit schedule</h2>
      {isLoggedIn && (
        <ScheduleEditor props={{ change: handleChange, schedule, unavails }} />
      )}
    </div>
  );
};

export default Schedule;

const ScheduleEditor = ({ props: { change, schedule, unavails } }) => {
  return (
    <div className='schedule-editor'>
      <div className='labels'>
        {schedule.map((day) => (
          <div className='label' key={day.name}>
            {day.name}
          </div>
        ))}
      </div>
      <div className='week'>
        {schedule.map((day) => (
          <div className='day' key={day.name}>
            {times.map((time) => {
              return (
                <Chunk
                  chunk={{ time, schedule, unavails, day, change }}
                  key={time}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

var parseTime = (time) => {
  let amOrPm = time.slice(time.length - 2, time.length);
  let slicedTime = time.slice(0, -4);
  let halfHour = time.split(':')[0][1] === ':3';
  if (amOrPm === 'AM' && time.slice(0, 2) === '12') {
    slicedTime = halfHour ? '0:5' : '0:0';
  }
  if (amOrPm === 'AM' && time.slice(0, 2) === '12') {
    slicedTime = halfHour ? '0:5' : '0:0';
  }
  slicedTime = slicedTime.replace(':', '.');
  if (slicedTime.split('.')[1] === '3') {
    slicedTime = slicedTime.replace('.3', '.5');
  }
  slicedTime = Number(slicedTime);
  if (amOrPm === 'PM' && time.slice(0, 2) !== '12') slicedTime += 12;
  return slicedTime;
};

var checkAvailability = ({ time, day, schedule, unavails }) => {
  let block = false;
  let startBlockData;
  time = parseTime(time);
  day.blockTimes.forEach(({ start, end, title }) => {
    let startTime = parseTime(start);
    let endTime = parseTime(end);
    if (time >= startTime && time < endTime) block = true;
    if (time === startTime)
      startBlockData = { startTime, endTime, start, end, title };
  });
  return { blockBool: block, start: startBlockData };
};

const Chunk = ({ chunk: { time, schedule, unavails, day, change } }) => {
  const [block, setBlock] = useState(false);
  const [start, setStart] = useState(null);
  useEffect(() => {
    let check = async () => {
      let { blockBool, start } = await checkAvailability({
        time,
        day,
        schedule,
        unavails,
      });
      setBlock(blockBool);
      setStart(start);
      if (start) console.log('Start: ', start);
    };
    check();
  }, []);
  let handleClick = () => change({ time, day: day.name, block });
  if (start) {
    console.log(`${(Number(start.endTime) - Number(start.startTime)) * 200}%`);
  }
  let height = '';
  if (start) {
    let { startTime, endTime } = start;
    height = `${(Number(endTime) - Number(startTime)) * 200}%`;
  }

  return (
    <div className='chunk-container'>
      <div onClick={handleClick} className={`chunk ${block && 'block'}`}>
        <p>{time}</p>
      </div>
      {start && (
        <div className='overlay-block' style={{ height }}>
          <div className='drag top' />
          <div className='middle'>
            <h6>{start.title}</h6>
            <p>
              <strong>start:</strong> {start.start}
            </p>
            <p>
              <strong>end:</strong> {start.end}
            </p>
          </div>
          <div className='drag bottom' />
        </div>
      )}
    </div>
  );
};

var arr1 = [
  {
    name: 'monday',
    blockTimes: [
      // '12:00 PM',
      // '12:30 PM',
      // '4:30 PM',
      // '4:00 PM',
      { start: '12:00 PM', end: '12:30 PM', title: 'tennis' },
      // { start: '15:30', end: '16:30' },
    ],
  },
  {
    name: 'tuesday',
    blockTimes: [
      { start: '12:00 PM', end: '5:00 PM', title: 'bjj' },
      { start: '8:00 PM', end: '11:30 PM', title: 'tennis' },
    ],
  },
  { name: 'wednesday', blockTimes: [] },
  { name: 'thursday', blockTimes: [] },
  { name: 'friday', blockTimes: [] },
  { name: 'saturday', blockTimes: [] },
  { name: 'sunday', blockTimes: [] },
];

var times = [
  '12:00 AM',
  '12:30 AM',
  '1:00 AM',
  '1:30 AM',
  '2:00 AM',
  '2:30 AM',
  '3:00 AM',
  '3:30 AM',
  '4:00 AM',
  '4:30 AM',
  '5:00 AM',
  '5:30 AM',
  '6:00 AM',
  '6:30 AM',
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',

  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
  '9:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
  '11:30 PM',
];

// var checkAvailability = ({ time, day, schedule, unavails }) => {
// time is the chunk, day.blockTimes is the array of recurring schedule unavailabilities
// let amOrPm = time.slice(time.length - 2, time.length);
// let slicedTime = time.slice(0, -4);
// let halfHour = time.split(':')[0][1] === ':3';
// if (amOrPm === 'AM' && time.slice(0, 2) === '12') {
//   slicedTime = halfHour ? '0:3' : '0:0';
// }
// slicedTime = slicedTime.replace(':', '.');
// slicedTime = Number(slicedTime);
// if (amOrPm === 'PM' && time.slice(0, 2) !== '12') slicedTime += 12;
// let scheduleArr = day.blockTimes;
// let block = false;
// scheduleArr.forEach(({ start, end }) => {
//   start = Number(start.replace(':', '.'));
//   end = Number(end.replace(':', '.'));
//   if (slicedTime >= start && slicedTime < end) {
//     block = true;
//   }
// });
// return block;
///////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
//   let blockArray = day.blockTimes;
//   let block = false;
//  blockArray.forEach((blockTime) => {
//     if (time === blockTime) block = true;
//   });
//   return {blockBool: block, time};
///////////////////////////////////////
// }

// parseNumber = (num) => {
//   let PM = false;
//   if (num > 12.5) PM = true;
//   if (PM) num -= 12;
//   //1.5
//   let halfHr = num % 1 !== 0;
//   //   console.log('half hr: ', num.toString().split('.')[1]);
//   num = num.toString();
//   // "1.5"
//   if (halfHr) num = num.replace('.5', ':30');
//   else num = num + ':00';

//   console.log('num: ', num);
//   return num;
// };

// parseNumber(13.5); // 1:30 PM
// parseNumber(1.5); // 1:30 AM
// parseNumber(12.5); // 12:30PM
// parseNumber(0.5); // 12:30AM
// parseNumber(24); // 10AM
