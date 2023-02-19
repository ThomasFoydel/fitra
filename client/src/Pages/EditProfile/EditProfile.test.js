import React from 'react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import EditProfile from './EditProfile.js'
import axios from '__mocks__/axios'
import Store from 'context/Store'

const exampleData = {
  name: 'Robert',
  bio: 'I do pushups sometimes',
  displayEmail: 'robert@robertmail.com',
}

describe('Edit Profile page', () => {
  jest.mock('axios')

  beforeEach(async () => {
    axios.put = jest.fn((url, body) => {
      if (url === '/api/client/profiles') return Promise.resolve({ data: { updatedProfile: body } })
    })

    render(
      <Store>
        <Router>
          <EditProfile />
        </Router>
      </Store>
    )
  })

  afterEach(cleanup)

  it('Should have three text inputs', () => {
    const inputs = screen.getAllByRole('textbox')
    expect(inputs.length).toEqual(3)
  })

  it('Should have a submit button', () => {
    const btn = screen.getByRole('button')
    expect(btn.textContent).toEqual('submit')
  })

  it('Should send put requests when changes are submitted and update state after response from server', async () => {
    const inputs = screen.getAllByRole('textbox')
    const btn = screen.getByRole('button')

    userEvent.type(inputs[0], exampleData.name)
    userEvent.click(btn)
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1))
    expect(inputs[0].placeholder).toEqual(exampleData.name)

    userEvent.type(inputs[1], exampleData.bio)
    userEvent.click(btn)
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(2))
    expect(inputs[1].placeholder).toEqual(exampleData.bio)

    userEvent.type(inputs[2], exampleData.displayEmail)
    userEvent.click(btn)
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(3))
    expect(inputs[2].placeholder).toEqual(exampleData.displayEmail)
  })

  it('Should have two images', () => {
    const imgs = screen.getAllByRole('img')
    expect(imgs.length).toEqual(2)
  })

  it('Should have a link back to profile', () => {
    const link = screen.getByRole('link')
    expect(link.href).toEqual('http://localhost/user/null')
  })
})
