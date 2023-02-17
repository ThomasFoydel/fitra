import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { render, screen, cleanup } from '@testing-library/react'
import axios from '__mocks__/axios'
import Store from 'context/Store'
import Home from './Home'

const today = new Date()
const todayPlusHalfHr = new Date()
todayPlusHalfHr.setMinutes(todayPlusHalfHr.getMinutes() + 30)
const exampleSession = {
  _id: '123',
  active: true,
  client: 'abc',
  startTime: today,
  endTime: todayPlusHalfHr,
}

describe('Client home page', () => {
  jest.mock('axios')
  beforeEach(async () => {
    axios.get = jest.fn((url) => {
      if (url === '/api/client/dashboard')
        return Promise.resolve({
          data: {
            sessions: [exampleSession],
          },
        })
    })
    render(
      <Store>
        <Router>
          <Home />
        </Router>
      </Store>
    )
  })

  afterEach(cleanup)

  it('Should have a title that says "Sessions"', async () => {
    await screen.findByText('Sessions')
    return screen.getAllByRole('heading')
  })

  it('Should display session information after receiving data from get request', async () => {
    const start = await screen.findByTestId('client-home-session-start')
    expect(start.textContent).toEqual(`${today.toDateString()} ${today.toLocaleTimeString()}`)
    const end = await screen.findByTestId('client-home-session-end')
    expect(end.textContent).toEqual(
      `${todayPlusHalfHr.toDateString()} ${todayPlusHalfHr.toLocaleTimeString()}`
    )
  })
})
