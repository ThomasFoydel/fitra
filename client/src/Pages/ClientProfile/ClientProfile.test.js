import React from 'react'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import ClientProfile from './ClientProfile'
import axios from '__mocks__/axios'
import Store from 'context/Store'

const exampleUser = {
  _id: '123',
  name: 'bert',
  bio: 'i am bert',
  coverPic: 'abcdefg',
  profilePic: '12345678',
  displayEmail: 'bert@bertmail.com',
}

describe('Client profile page', () => {
  jest.mock('axios')
  beforeEach(async () => {
    axios.get = jest.fn((url) => {
      if (url === `/api/client/profile/${exampleUser._id}`) {
        return Promise.resolve({
          data: { foundUser: exampleUser },
        })
      }
    })
    render(
      <Store>
        <ClientProfile match={{ params: { id: exampleUser._id } }} />
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
    expect(img.src).toEqual('http://localhost/spin.gif')
  })
})
