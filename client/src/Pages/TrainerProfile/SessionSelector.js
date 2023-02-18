import axios from 'axios'
import { toast } from 'react-toastify'
import React, { useState, useEffect, useContext } from 'react'
import { days, halfHours, setUpWeek, dateFromDateAndTime } from '../../util/util'
import PayPal from 'Components/PayPal/PayPal'
import { CTX } from 'context/Store'

const SessionSelector = ({
  selection,
  bookedTimes,
  setSelection,
  setBookingSuccess,
  belongsToCurrentUser,
  trainer: { availability, _id, minimum, rate, name, active },
}) => {
  const [{ isLoggedIn }, updateState] = useContext(CTX)
  const [weekShift, setWeekShift] = useState(0)
  const [week, setWeek] = useState(setUpWeek(0))
  const [mouseIsDown, setMouseIsDown] = useState(false)
  const [payPalOpen, setPayPalOpen] = useState(false)
  const [minMet, setMinMet] = useState(false)
  const mouseDown = () => setMouseIsDown(true)
  const mouseUp = () => setMouseIsDown(false)

  useEffect(() => {
    window.addEventListener('mousedown', mouseDown)
    window.addEventListener('mouseup', mouseUp)
    return () => {
      window.removeEventListener('mousedown', mouseDown)
      window.removeEventListener('mouseup', mouseUp)
    }
  }, [])

  const handleMouseOver = (e) => {
    if (mouseIsDown) {
      handleGridClick(e)
    }
  }

  const handleGridClick = (e) => {
    const { day, hour } = JSON.parse(e.target.id)
    const dayIndex = days.indexOf(day)
    const date = week[dayIndex]
    const hourDate = dateFromDateAndTime(date, hour)

    /* check if hourDate already in selection, if it is, remove it */
    const alreadySelected = selection.some((s) => s.hourDate.toString() === hourDate.toString())

    if (alreadySelected) {
      setSelection((selections) => {
        const filtered = selections.filter((s) => s.hourDate.toString() !== hourDate.toString())

        const sortedFiltered = filtered.sort(
          (a, b) => halfHours.indexOf(a.hour) - halfHours.indexOf(b.hour)
        )

        let allAdjacent = true
        let lastIndex
        sortedFiltered.forEach((s, i) => {
          if (i > 0) {
            const diff = halfHours.indexOf(s.hour) - halfHours.indexOf(sortedFiltered[i - 1].hour)

            if (diff !== 1) {
              /* selections are not contiguous, selection must be cut */
              lastIndex = i - 1
              allAdjacent = false
            }
          }
        })

        if (allAdjacent) return filtered
        else return sortedFiltered.filter((_, i) => i <= lastIndex)
      })
    } else {
      /* does not yet exist, so add this halfhour to selections
       check if clicked halfhour is adjacent to an item in the selection */
      let adjacent = false
      selection.forEach((s) => {
        /* check if date is the same */
        const sYear = s.hourDate.getFullYear()
        const sMonth = s.hourDate.getMonth()
        const sDate = s.hourDate.getDate()

        const year = hourDate.getFullYear()
        const month = hourDate.getMonth()
        const date = hourDate.getDate()
        if (sYear === year && sMonth === month && sDate === date) {
          /* same day */
          let sHour = s.hourDate.getHours() * 2
          const sMinutes = s.hourDate.getMinutes()
          if (sMinutes === 30) sHour += 1
          const clickedIndex = halfHours.indexOf(hour)
          if (sHour - clickedIndex === 1 || sHour - clickedIndex === -1) {
            adjacent = true
          }
        }
      })

      const newTime = { day, hour, hourDate }

      if (adjacent) {
        setSelection((selections) => {
          /* sort selections by hourDate */
          const newArray = [...selections, newTime]
          return newArray.sort((a, b) => a.hourDate - b.hourDate)
        })
      } else {
        setSelection([newTime])
      }
    }
  }

  useEffect(() => {
    let subscribed = true
    if (subscribed) setMinMet(minimum <= selection.length)
    return () => (subscribed = false)
  }, [selection, minimum])

  const shiftWeek = (n) => {
    setWeek(setUpWeek(n))
    setWeekShift(n)
  }

  const handleBooking = (order) => {
    setPayPalOpen(false)

    if (belongsToCurrentUser) return toast.error("you can't book yourself!")
    if (!minMet) return toast.error(`minimum time for booking is ${minimum * 60} minutes`)

    const startTime = selection[0].hourDate.toUTCString()
    const endTimeDate = new Date(selection[selection.length - 1].hourDate.getTime())
    endTimeDate.setMinutes(endTimeDate.getMinutes() + 30)
    const endTime = endTimeDate.toUTCString()

    const token = localStorage.getItem('fitr-token')
    axios
      .post(
        '/api/session/new',
        { startTime, endTime, order, trainer: _id },
        { headers: { 'x-auth-token': token } }
      )
      .then(({ data: { newSession } }) => {
        if (newSession) setBookingSuccess(true)
      })
  }

  const showRegister = () => {
    updateState({ type: 'CHANGE_AUTH_PAGE', payload: { page: 'register' } })
    updateState({ type: 'TOGGLE_AUTH' })
  }

  const startTime = selection[0] ? selection[0].hourDate.toUTCString() : ''
  const endTime = selection[selection.length - 1]
    ? selection[selection.length - 1].hourDate.toUTCString()
    : ''

  const handlePayPalOpen = () => (isLoggedIn ? setPayPalOpen(true) : showRegister())

  const selectionStart = selection[0]
  if (selectionStart) selectionStart.dateString = selectionStart.hourDate.toDateString()

  const selectionEnd = {}
  const selectionRangeEnd = selection[selection.length - 1]
  if (selectionRangeEnd) {
    selectionEnd.hour = halfHours[halfHours.indexOf(selectionRangeEnd.hour) + 1]
    const today = selection[selection.length - 1].day
    const todayIndex = days.indexOf(today)
    const endIsMidnight = selectionEnd.hour === '12:00 AM'
    const tomorrow = todayIndex < days.length - 1 ? days[days.indexOf(today) + 1] : days[0]
    selectionEnd.day = endIsMidnight ? tomorrow : today
    const tomorrowDate = new Date(selection[selection.length - 1].hourDate.getTime() + 86400000)
    const todayHourDate = selection[selection.length - 1].hourDate.toDateString()
    selectionEnd.dateString = endIsMidnight ? tomorrowDate.toDateString() : todayHourDate
  }

  let price = rate * selection.length
  if (!rate && rate !== 0) price = 50
  if (isNaN(price)) price = 50
  if (price === 0) price = 0.01

  return (
    <div className="session-selector">
      <div className="ctrls">
        <div className="weekshift-btns">
          <button
            data-testid="back-btn"
            className="weekshift-btn"
            onClick={() => shiftWeek(weekShift - 1)}
          >
            <i className="far fa-arrow-alt-circle-left fa-4x"></i>
          </button>
          <button
            data-testid="forward-btn"
            className="weekshift-btn"
            onClick={() => shiftWeek(weekShift + 1)}
          >
            <i className="far fa-arrow-alt-circle-right fa-4x"></i>
          </button>
        </div>
        <div className="booking">
          {isNaN(minimum) || minimum <= 0 || !active ? (
            <p>this trainer's scheduling is not set up</p>
          ) : (
            <>
              {selectionStart ? (
                <>
                  <div className="beginning">
                    {selectionStart.day} - {selectionStart.hour} - {selectionStart.dateString}
                  </div>
                  <div className="end">
                    {selectionEnd.day} - {selectionEnd.hour} - {selectionEnd.dateString}
                  </div>
                </>
              ) : (
                <p>Select time below, miminum: {minimum * 30} minutes</p>
              )}
              {selection && selection.length > 0 && (
                <button className={`booking-btn minmet-${minMet}`} onClick={handlePayPalOpen}>
                  book
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="relative-container">
        <div className="labels">
          {Object.keys(week).map((key, i) => {
            const day = week[key]
            const string = day.toDateString().substring(0, day.toDateString().length - 4)
            const today = new Date()
            return (
              <div
                className={`day-label today-${today.getDay() === day.getDay() && weekShift === 0}`}
                key={key}
              >
                {string}
              </div>
            )
          })}
        </div>
        <div className="drag-n-drop">
          <div className="time-grid">
            {days.map((day) => (
              <div className="grid-day" key={day}>
                {halfHours.map((hour, i) => {
                  if (i < 48) {
                    const dayIndex = days.indexOf(day)
                    const dayDate = week[dayIndex]
                    const hourDate = dateFromDateAndTime(dayDate, hour)
                    const selected = selection.some(
                      (s) => s.hourDate.toString() === hourDate.toString()
                    )

                    let blocked
                    if (availability)
                      availability.forEach((entry) => {
                        const startDate = new Date(entry.startDate)
                        const endDate = new Date(entry.endDate)
                        if (hourDate >= startDate && hourDate < endDate) blocked = true
                      })
                    if (bookedTimes) {
                      bookedTimes.forEach((time) => {
                        const startDate = new Date(time.startTime)
                        const endDate = new Date(time.endTime)
                        if (hourDate >= startDate && hourDate < endDate) blocked = true
                      })
                    }
                    return (
                      <div
                        key={hour}
                        id={JSON.stringify({ day, hour })}
                        onMouseOver={blocked ? () => {} : handleMouseOver}
                        onMouseDown={blocked ? () => {} : handleGridClick}
                        className={`grid-time ${selected && 'selected-true'} ${
                          blocked && 'unavailable'
                        }`}
                        style={{ background: `rgb(${0 + i * 2}, ${110 - i / 2}, ${159 + i * 2})` }}
                      >
                        {hour}
                      </div>
                    )
                  } else return null
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {payPalOpen && (
        <PayPal
          props={{
            price,
            setPayPalOpen,
            complete: handleBooking,
            desc: `Booking ${name} for ${startTime} - ${endTime}`,
          }}
        />
      )}
    </div>
  )
}

export default SessionSelector
