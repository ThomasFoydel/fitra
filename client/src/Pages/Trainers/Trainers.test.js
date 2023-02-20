import React from 'react'
import axios from '__mocks__/axios'
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import Trainers from './Trainers'
import Store from 'context/Store'

const exampleTrainer = {
  minimum: 1,
  _id: '123',
  maximum: 4,
  name: 'bert',
  active: true,
  bio: 'i am bert',
  coverPic: 'abcdefg',
  profilePic: '12345678',
  tags: ['mma', 'wrestling'],
  displayEmail: 'bert@bertmail.com',
}

const exampleSearch = 'a'

describe('Trainers search page', () => {
  jest.mock('axios')
  beforeEach(async () => {
    axios.get = jest.fn((url) => {
      if (url.includes('/api/client/search') && url.includes(`search=${exampleSearch}`))
        return Promise.resolve({ data: { result: [exampleTrainer] } })
    })
    render(
      <Store>
        <Router>
          <Trainers />
        </Router>
      </Store>
    )
  })
  afterEach(cleanup)

  it('Should have a text input', () => expect(screen.getByRole('textbox')).toBeInTheDocument())

  it('Should send a get request to the /api/client/search routes with the search input included in the body', async () => {
    const input = screen.getByRole('textbox')
    userEvent.type(input, exampleSearch)
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1))
  })

  it('Should display trainers info after server response', async () => {
    const input = screen.getByRole('textbox')
    userEvent.type(input, exampleSearch)
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1))
    expect(screen.getByText(exampleTrainer.name)).toBeInTheDocument()
    expect(screen.getByText(exampleTrainer.bio)).toBeInTheDocument()
    expect(screen.getByText(exampleTrainer.tags[0])).toBeInTheDocument()
    expect(screen.getAllByRole('img')[0]).toBeInTheDocument()
  })

  it('Should have links to trainer profiles after server response', async () => {
    const input = screen.getByRole('textbox')
    userEvent.type(input, exampleSearch)
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1))
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link.href).toContain(`trainer/${exampleTrainer._id}`)
  })

  it('Should have a select input with options for searching by either name or tags', () => {
    const options = screen.getAllByRole('option')
    expect(options.length).toEqual(2)
    expect(options[0].textContent).toEqual('tags')
    expect(options[1].textContent).toEqual('name')
  })
})
