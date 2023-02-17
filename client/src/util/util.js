export const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

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
]

export const getOneHalfHourAhead = (hour) => {
  const index = halfHours.indexOf(hour)
  return halfHours[index + 1]
}

export const setUpWeek = (weekShift) => {
  const mSecondsInADay = 86400000
  const mSecondsInAWeek = 604800000

  const current = new Date()
  const dayOfWeek = current.getDay()
  const currentTime = current.getTime()

  /* nowDate = the current day of the week, shifted to whatever the current week is */
  const nowDate = new Date(currentTime + mSecondsInAWeek * weekShift)
  const now = nowDate.getTime()

  const weekObj = {}

  /* fill in forwards to saturday */
  for (let i = dayOfWeek; i < 7; i++) {
    const daysFromCurrent = i - dayOfWeek
    const mSecondsPassed = daysFromCurrent * mSecondsInADay
    const date = new Date(now + mSecondsPassed)
    weekObj[i] = date
  }

  /* fill in backwards to monday, if day is not sunday */
  if (dayOfWeek > 0) {
    let count = 1
    for (let j = dayOfWeek; j > 0; j--) {
      let daysBefore = count * mSecondsInADay
      let date = new Date(nowDate - daysBefore)
      weekObj[j - 1] = date
      count++
    }
  }

  return weekObj
}

export const checkBlock = (data, week) => {
  if (data.recurring === true) return true
  const start = week[0]
  const end = week[6]

  const startYear = start.getFullYear()
  let startMonth = Number(start.getMonth())
  if (startMonth < 10) startMonth = `0${startMonth}`
  const startDay = start.getDate()
  const startWeek = new Date(startYear, startMonth, startDay, '00', '00', '00')

  const endYear = end.getFullYear()
  let endMonth = end.getMonth()
  if (endMonth < 10) endMonth = `0${endMonth}`
  const endDay = end.getDate()
  const endWeek = new Date(endYear, endMonth, endDay, '23', '59', '59', '999')

  const block = new Date(data.startDate)
  return block >= startWeek && block < endWeek
}

export const dateFromDateAndTime = (date, time, startTime) => {
  const newYear = date.getFullYear()
  const newMonth = Number(date.getMonth())
  let newDay = Number(date.getDate())

  const splitTime = time.split(':')
  let newHour = Number(splitTime[0])
  const afterNoon = splitTime[1].split(' ')[1] === 'PM'
  if (afterNoon && newHour !== 12) newHour += 12
  /* if it is 12:00am */
  if (!afterNoon && newHour === 12) newHour = 0
  const newMin = splitTime[1].split(' ')[0]
  /* if it is 12:00am and this is not a start time, increase day by 1 (its 12:00AM the next day) */
  if (startTime && newHour === 0) {
    const startIndex = halfHours.indexOf(startTime)
    if (startIndex > 0) newDay++
  }
  return new Date(newYear, newMonth, newDay, newHour, newMin)
}

export const getHalfHourFromDate = (date) => {
  if (typeof date === 'string') date = new Date(date)
  let sHour = date.getHours() * 2
  const sMinutes = date.getMinutes()
  if (sMinutes === 30) sHour += 1
  return halfHours[sHour]
}
