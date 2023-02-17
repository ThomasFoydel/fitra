import React from 'react'
import { v4 as uuidv4 } from 'uuid'
import { dateFromDateAndTime } from '../../../../util/util'
import Day from './parts/Day'

const MobileSchedule = ({
  props: { days, week, displayBlocks, setDisplayBlocks, setActualBlocks },
}) => {
  const handleSubmitTime = ({ timeSelection: { start, end }, day }) => {
    const selectedDate = week[days.indexOf(day)]
    const startTime = `${start.hour}:${start.minute} ${start.amOrPm}`
    const startDate = dateFromDateAndTime(selectedDate, startTime)
    const endTime = `${end.hour}:${end.minute} ${end.amOrPm}`
    const endDate = dateFromDateAndTime(selectedDate, endTime)

    if (startDate.getTime() > endDate.getTime()) {
      return console.error('error: start time cannot be after end time')
    }

    const newBlock = {
      day,
      endDate,
      title: '',
      startDate,
      id: uuidv4(),
      end: endTime,
      recurring: false,
      start: startTime,
    }

    setDisplayBlocks((displayBlocks) => [...displayBlocks, newBlock])
    setActualBlocks((actualBlocks) => [...actualBlocks, newBlock])
  }

  return (
    <div className="mb-schedule">
      <h3 className="title">schedule</h3>
      {days.map((day, i) => (
        <Day
          key={day}
          props={{ currentDate: new Date(week[i]), day, displayBlocks, handleSubmitTime }}
        />
      ))}
    </div>
  )
}

export default MobileSchedule
