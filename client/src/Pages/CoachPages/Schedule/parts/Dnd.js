import { Rnd } from 'react-rnd'
import React, { useState, useEffect } from 'react'
import { dateFromDateAndTime } from '../../../../util/util'

const Dnd = ({
  data,
  week,
  days,
  times,
  destroy,
  invisible,
  setActualBlocks,
  setDisplayBlocks,
}) => {
  const [startDate, setStartDate] = useState(new Date(data.startDate))
  const [endDate, setEndDate] = useState(new Date(data.endDate))
  const [recurring, setRecurring] = useState(data.recurring)
  const [startTime, setStartTime] = useState(data.start)
  const [endTime, setEndTime] = useState(data.end)
  const [firstLoad, setFirstLoad] = useState(true)
  const [day, setDay] = useState(data.day)

  let startIdx = times.indexOf(data.start)
  let endIdx = times.indexOf(data.end)
  if (startIdx === 47) endIdx = 48
  let initialHeight = endIdx - startIdx
  initialHeight *= 50
  startIdx *= 50
  const xDefault = days.indexOf(data.day) * 120

  const handleDestroy = () => destroy(data.id)

  const updateBlocks = (startDate, endDate, startTime, endTime, recurring) => {
    const day = days[startDate.getDay()]

    const newTime = {
      day,
      endDate,
      recurring,
      startDate,
      id: data.id,
      end: endTime,
      start: startTime,
    }

    setDisplayBlocks((times) => {
      const index = times.findIndex((x) => x.id === data.id)
      const copy = [...times]
      copy[index] = newTime
      return copy
    })

    setActualBlocks((entries) => {
      const index = entries.findIndex((x) => x.id === data.id)
      const copy = [...entries]
      copy[index] = newTime
      return copy
    })
  }

  const handleDrag = (_, el) => {
    const { node } = el
    const { transform, height } = node.style

    /* NEW DAY */
    let elementXPosition = el.x
    elementXPosition -= 60
    let x = Math.ceil(elementXPosition / 120)

    /* NEW START TIME */
    let elementYPosition = transform.split(', ')[1]
    elementYPosition = elementYPosition.substring(0, elementYPosition.length - 3)
    elementYPosition = Number(elementYPosition)

    if (elementYPosition < 50 && elementYPosition > -50) elementYPosition = 0
    if (elementYPosition < 0) elementYPosition += 2750
    const startIndex = Math.ceil(elementYPosition / 50)

    const mSecondsInADay = 86400000
    const index = x - days.indexOf(day)
    const timeDifference = mSecondsInADay * index
    const prevDate = week[days.indexOf(day)]
    const newDate = new Date(prevDate.getTime() + timeDifference)
    const newStartTime = times[startIndex]
    const newStartDate = dateFromDateAndTime(newDate, newStartTime)

    /* NEW END TIME */
    if (Number(height) < 0) height = 0
    let elementHeight = height.substring(0, height.length - 2)
    elementHeight /= 50
    const endTime = times[startIndex + elementHeight]
    const newEndDate = dateFromDateAndTime(newDate, endTime, newStartTime)

    /* UPDATE STATE */
    setDay(days[x])
    setEndTime(endTime)
    setEndDate(newEndDate)
    setStartDate(newStartDate)
    setStartTime(times[startIndex])
    updateBlocks(newStartDate, newEndDate, newStartTime, endTime, recurring)
  }

  const handleResize = ({}, {}, refToElement) => {
    let { transform, height } = refToElement.style
    let elementYPosition = transform.split(', ')[1]
    elementYPosition = elementYPosition.substring(0, elementYPosition.length - 3)
    const start = times[elementYPosition / 50]
    let elementHeight = height.substring(0, height.length - 2)
    elementHeight /= 50
    const startIndex = times.indexOf(start)
    const newEndTime = times[startIndex + elementHeight]
    if (newEndTime && newEndTime !== startTime) {
      const newStartDate = dateFromDateAndTime(endDate, startTime)
      const newEndDate = dateFromDateAndTime(endDate, newEndTime, startTime)
      updateBlocks(newStartDate, newEndDate, startTime, newEndTime, recurring)
      setEndDate(newEndDate)
      setEndTime(newEndTime)
    }
  }

  const toggleRecurring = () => {
    const dayOfWeek = startDate.getDay()
    const currentWeekDate = week[dayOfWeek]
    const newStartDate = dateFromDateAndTime(currentWeekDate, startTime)
    const newEndDate = dateFromDateAndTime(currentWeekDate, endTime, startTime)
    setRecurring((recurring) => !recurring)
    setStartDate(newStartDate)
    setEndDate(newEndDate)
  }

  useEffect(() => {
    if (firstLoad) setFirstLoad(false)
    else updateBlocks(startDate, endDate, startTime, endTime, recurring)
  }, [recurring])

  return (
    <Rnd
      bounds="parent"
      resizeGrid={[0, 50]}
      dragGrid={[120, 50]}
      onDragStop={handleDrag}
      onResizeStop={handleResize}
      default={{
        width: 120,
        x: xDefault,
        y: startIdx,
        height: `${initialHeight}px`,
      }}
      style={{
        position: 'absolute',
        zIndex: invisible ? '-1' : '1',
        opacity: invisible ? '0' : '1',
      }}
      enableResizing={{ bottom: true }}
      resizeHandleClasses={{ bottom: 'drag-bottom' }}
      className={`rnd-item rnd-blocked-time recurring-${recurring}`}
    >
      <div>
        <p className="item-day">{day}</p>

        <button
          className="delete-btn"
          onClick={handleDestroy}
          onMouseDown={(event) => event.stopPropagation()}
        >
          X
        </button>
        <p className="item-time">
          {startTime} - {endTime}
        </p>
        <button
          className="recurring-btn"
          onClick={toggleRecurring}
          onMouseDown={(event) => event.stopPropagation()}
        >
          R
        </button>
      </div>
    </Rnd>
  )
}

export default Dnd
