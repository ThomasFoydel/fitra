import { v4 as uuidv4 } from 'uuid'
import React, { useState, useEffect } from 'react'
import MobileSchedule from './Mobile/MobileSchedule'
import WeekShift from './parts/WeekShift'
import Session from './parts/Session'
import Labels from './parts/Labels'
import MinMax from './parts/MinMax'
import Dnd from './parts/Dnd'
import './Schedule.scss'
import {
  dateFromDateAndTime,
  getOneHalfHourAhead,
  checkBlock,
  halfHours,
  setUpWeek,
  days,
} from '../../../util/util'

const Schedule = ({
  props: { change, entries, handleMinMax, max, min, sessions, setSessions },
}) => {
  const [displayBlocks, setDisplayBlocks] = useState(entries)
  const [actualBlocks, setActualBlocks] = useState(entries)
  const [firstRender, setFirstRender] = useState(true)
  const [weekShift, setWeekShift] = useState(0)
  const current = new Date()
  const currentWeek = setUpWeek(0)
  const dayOfWeek = current.getDay()
  const [week, setWeek] = useState(currentWeek)
  

  useEffect(() => {
    let subscribed = true
    if (subscribed)
      if (firstRender) setFirstRender(false)
      else change(actualBlocks)
    return () => (subscribed = false)
  }, [actualBlocks])

  const destroy = (id) => {
    setDisplayBlocks((blocks) => {
      const block = blocks.filter((b) => b.id === id)[0]
      const index = blocks.indexOf(block)
      const copy = [...blocks]
      copy[index].invisible = true
      return blocks
    })
    setActualBlocks((blocks) => blocks.filter((block) => block.id !== id))
  }

  const handleGridClick = (e) => {
    const { day, hour } = JSON.parse(e.target.id)
    const dayIndex = days.indexOf(day)
    const clicked = week[dayIndex]
    const clickedDate = clicked.getDate()
    const clickedMonth = clicked.getMonth()
    const clickedYear = clicked.getFullYear()

    const cDate = new Date(clickedYear, clickedMonth, clickedDate)
    const startDate = dateFromDateAndTime(cDate, hour)

    const endTime = startDate.getTime() + 1800000
    const endDate = new Date(endTime)
    const endHour = getOneHalfHourAhead(hour)

    const newBlock = {
      day,
      endDate,
      title: '',
      startDate,
      start: hour,
      id: uuidv4(),
      end: endHour,
      recurring: false,
    }
    setDisplayBlocks([...displayBlocks, newBlock])
    setActualBlocks([...actualBlocks, newBlock])
  }

  const handleWeekShift = (newShift) => {
    setWeek(setUpWeek(newShift))
    setWeekShift(newShift)
  }

  const newDate = new Date()
  const today = newDate.getDay()

  return (
    <div className="schedule">
      <div className="ctrl-panel">
        <MinMax props={{ handleMinMax, min, max }} />
        <WeekShift props={{ handleWeekShift, weekShift }} />
      </div>

      <div className="schedule-spacer" />

      <div className="large-schedule">
        <div className="drag-n-drop">
          <Labels props={{ week, weekShift, today }} />

          <div className="time-grid">
            {days.map((day) => (
              <div className="grid-day" key={day}>
                {halfHours.map((hour, i) => {
                  if (i < 48)
                    return (
                      <div
                        key={hour}
                        className="grid-time"
                        onClick={handleGridClick}
                        id={JSON.stringify({ day, hour })}
                        style={{
                          background: `rgb(${0 + i * 2}, ${110 - i / 2}, ${159 + i * 2})`,
                        }}
                      >
                        {hour}
                      </div>
                    )
                  else return null
                })}
              </div>
            ))}
          </div>

          {sessions.map((data) => {
            const inCurrentWeek = checkBlock(data, week)
            return <Session props={{ data, inCurrentWeek, setSessions }} key={data.id} />
          })}

          {displayBlocks.map((data) => {
            const inCurrentWeek = checkBlock(data, week)
            return (
              <Dnd
                days={days}
                data={data}
                week={week}
                key={data.id}
                times={halfHours}
                destroy={destroy}
                currentDay={dayOfWeek}
                setActualBlocks={setActualBlocks}
                setDisplayBlocks={setDisplayBlocks}
                invisible={inCurrentWeek ? data.invisible : true}
              />
            )
          })}
        </div>
      </div>

      <MobileSchedule
        props={{
          days,
          week,
          entries,
          halfHours,
          dayOfWeek,
          actualBlocks,
          displayBlocks,
          setActualBlocks,
          setDisplayBlocks,
        }}
      />
    </div>
  )
}

export default Schedule
