import React from 'react'
import axios from '__mocks__/axios'
import userEvent from '@testing-library/user-event'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import TrainerProfile from './TrainerProfile'
import Store from 'context/Store'

const exampleUser = {
  _id: '123',
  minimum: 1,
  maximum: 4,
  name: 'bert',
  active: true,
  bio: 'i am bert',
  coverPic: 'abcdefg',
  profilePic: '12345678',
  displayEmail: 'bert@bertmail.com',
}

describe('Trainer profile page', () => {
  jest.mock('axios')
  beforeEach(async () => {
    axios.get = jest.fn((url) => {
      if (url.includes('/api/client/trainers/')) {
        return Promise.resolve({
          data: {
            foundAvg: 3.4,
            foundReviews: [],
            foundSessions: [],
            trainer: exampleUser,
          },
        })
      }
    })
    render(
      <Store>
        <TrainerProfile />
      </Store>
    )

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1))
  })
  afterEach(cleanup)

  it('Should display client info after GET request', () => {
    screen.getByText(exampleUser.name)
    screen.getByText(exampleUser.bio)
    screen.getByText(exampleUser.displayEmail)
  })

  it('Should display loading spinner initially', () => {
    const img = screen.getByRole('img')
    expect(img.src).toContain('spin.gif')
  })

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

  it('Should display booking button when time is selected', async () => {
    const sundayNoon = screen.getAllByText('12:00 AM')[0]
    userEvent.click(sundayNoon)
    expect(screen.getByText('book')).toBeInTheDocument()
  })
})
