export const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const halfHours = [
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
  '12:00 AM',
];

export const getOneHalfHourAhead = (hour) => {
  let index = halfHours.indexOf(hour);
  return halfHours[index + 1];
};

export const setUpWeek = (weekShift) => {
  const mSecondsInADay = 86400000;
  const mSecondsInAWeek = 604800000;

  let current = new Date();
  const dayOfWeek = current.getDay();
  let currentTime = current.getTime();

  // nowDate = the current day of the week, shifted to whatever the current week is
  let nowDate = new Date(currentTime + mSecondsInAWeek * weekShift);
  let now = nowDate.getTime();

  let weekObj = {};

  // fill in forwards to saturday
  for (let i = dayOfWeek; i < 7; i++) {
    const daysFromCurrent = i - dayOfWeek;
    const mSecondsPassed = daysFromCurrent * mSecondsInADay;
    const date = new Date(now + mSecondsPassed);
    weekObj[i] = date;
  }
  // fill in backwards to monday, if day is not sunday
  if (dayOfWeek > 0) {
    let count = 1;
    for (let j = dayOfWeek; j > 0; j--) {
      let daysBefore = count * mSecondsInADay;
      let date = new Date(nowDate - daysBefore);
      weekObj[j - 1] = date;
      count++;
      //
      //
      // let daysBefore = j * mSecondsInADay;
      // let date = new Date(current - daysBefore);
      // weekObj[j - 1] = date;
      //
      ////
      // let timeBefore = (6 - j) * mSecondsInADay;
      // let date = new Date(current - timeBefore);
      // weekObj[j - 1] = date;
    }
  }
  return weekObj;
};

export const checkBlock = (data, week) => {
  if (data.recurring === true) return true;
  let start = week[0];
  let end = week[6];

  let startYear = start.getFullYear();
  let startMonth = Number(start.getMonth());
  if (startMonth < 10) startMonth = `0${startMonth}`;
  let startDay = start.getDate();
  let startWeek = new Date(startYear, startMonth, startDay, '00', '00', '00');

  let endYear = end.getFullYear();
  let endMonth = end.getMonth();
  if (endMonth < 10) endMonth = `0${endMonth}`;
  let endDay = end.getDate();
  let endWeek = new Date(endYear, endMonth, endDay, '23', '59', '59', '999');

  let block = data.startDate;
  if (block >= startWeek && block < endWeek) {
    return true;
  } else return false;
};

export const dateFromDateAndTime = (date, time, startTime) => {
  let newYear = date.getFullYear();
  let newMonth = Number(date.getMonth());
  // if (newMonth < 10) newMonth = `0${newMonth}`;
  let newDay = Number(date.getDate());

  let split = time.split(':');
  let newHour = Number(split[0]);
  let afterNoon = split[1].split(' ')[1] === 'PM';
  if (afterNoon && newHour !== 12) newHour += 12;
  // if it is 12:00am
  if (!afterNoon && newHour === 12) newHour = 0;
  let newMin = split[1].split(' ')[0];
  // if it is 12:00am and this is not a start time, increase day by 1 (its 12:00AM the next day)
  if (startTime && newHour === 0) {
    let startIndex = halfHours.indexOf(startTime);
    if (startIndex > 0) {
      newDay++;
    }
  }
  let newDate = new Date(newYear, newMonth, newDay, newHour, newMin);
  return newDate;
};

// export const toTimeNumber = (string) => {
//   let afterNoon = string.split(' ')[1] === 'PM';
//   let time = string.split(' ')[0];
//   let hour = time.split(':')[0];
//   let halfHour = time.split(':')[1];
//   if (afterNoon) hour = Number(hour) + 12;
//   if (hour < 10) hour = `0${hour}`;
//   // return `${hour}:${halfHour}`;
//   return { hour, min: halfHour };
// };
