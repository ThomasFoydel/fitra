import React, { useState } from 'react'
import TimeInput from './TimeInput'

const Day = ({ props: { currentDate, day, displayBlocks, handleSubmitTime } }) => {
  const [addTimeOpen, setAddTimeOpen] = useState(false)

  const [timeSelection, setTimeSelection] = useState({
    start: { minute: '00', hour: '1', amOrPm: 'AM' },
    end: { minute: '30', hour: '1', amOrPm: 'AM' },
  })
  
  const { start, end } = timeSelection

  const toggleOpen = () => setAddTimeOpen((o) => !o)

  const handleTimeSelect = ({ id, value, label }) => {
    setTimeSelection((s) => ({ ...s, [label]: { ...s[label], [id]: value } }))
  }

  return (
    <div className="mb-day">
      <h3>{currentDate.toDateString()}</h3>

      {Object.keys(displayBlocks).map((key) => {
        let { startDate, endDate, _id, id } = displayBlocks[key]
        startDate = new Date(startDate)
        endDate = new Date(endDate)
        const belongsOnCurrent = currentDate.toDateString() === startDate.toDateString()

        if (!belongsOnCurrent) return null
        return (
          <div key={_id || id}>
            {belongsOnCurrent && (
              <div className="mb-block">
                <p>start: {startDate.toDateString()}</p>
                <p>end: {endDate.toDateString()}</p>
              </div>
            )}
          </div>
        )
      })}

      <div
        className="addtime-form"
        style={{
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          height: addTimeOpen ? '16rem' : '0rem',
        }}
      >
        <button className="close-btn" onClick={toggleOpen}>
          <i className="fas fa-times fa-2x" />
        </button>

        <TimeInput
          props={{
            id: 'start',
            value: start,
            label: 'start',
            handleTimeSelect,
          }}
        />
        <TimeInput
          props={{
            id: 'end',
            value: end,
            label: 'end',
            handleTimeSelect,
          }}
        />
        <button onClick={() => handleSubmitTime({ timeSelection, day })}>submit</button>
      </div>

      {!addTimeOpen && (
        <button className="addtime-btn" onClick={toggleOpen}>
          add time
        </button>
      )}
    </div>
  )
}

export default Day
