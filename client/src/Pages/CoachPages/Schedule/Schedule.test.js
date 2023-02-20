import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen, cleanup } from '@testing-library/react'
import ScheduleContainer from './ScheduleContainer'
import axios from '__mocks__/axios'
import Store from 'context/Store'
import Schedule from './Schedule'

describe('Trainer schedule page', () => {
  beforeEach(async () => {
    render(
      <Schedule
        props={{
          max: 2,
          min: 1,
          err: '',
          entries: [],
          sessions: [],
          change: jest.fn,
          setSessions: jest.fn,
          handleMinMax: jest.fn,
        }}
      />
    )
  })

  afterEach(cleanup)

  it('Should display current date', async () => {
    const newDate = new Date()
    const currentDate = newDate.toDateString().substring(0, newDate.toDateString().length - 5)
    await screen.findByText(currentDate)
  })

  it('Should shift the dates back/forth by one week when weekshift buttons are clicked', async () => {
    const today = new Date()
    const todayString = today.toDateString().substring(0, today.toDateString().length - 5)

    const nextWeek = new Date()
    nextWeek.setMinutes(nextWeek.getMinutes() + 10080)
    const nextWeekString = nextWeek.toDateString().substring(0, nextWeek.toDateString().length - 5)

    const lastWeek = new Date()
    lastWeek.setMinutes(lastWeek.getMinutes() - 10080)
    const lastWeekString = lastWeek.toDateString().substring(0, lastWeek.toDateString().length - 5)

    const fwdBtn = screen.getByTestId('forward-btn')
    const bckBtn = screen.getByTestId('back-btn')

    userEvent.click(fwdBtn)
    await screen.findByText(nextWeekString)
    userEvent.click(bckBtn)

    await screen.findByText(todayString)
    userEvent.click(bckBtn)
    await screen.findByText(lastWeekString)
  })
})

describe('Trainer schedule container', () => {
  jest.mock('axios')
  beforeEach(async () => {
    axios.get.mockReturnValue(
      Promise.resolve({
        data: {
          min: 1,
          max: 4,
          foundSessions: [],
          entries: [
            {
              id: 'abc',
              _id: '123',
              endDate: new Date(),
              startDate: new Date(),
            },
          ],
        },
      })
    )

    axios.post.mockReturnValue(Promise.resolve({ data: [] }))

    render(
      <Store>
        <ScheduleContainer />
      </Store>
    )
  })

  afterEach(cleanup)

  it('Should display unavailable times of entries recieved from API after get request', async () => {
    const today = new Date()
    await screen.findByText(`start: ${today.toDateString()}`)
    await screen.findByText(`end: ${today.toDateString()}`)
  })
})
