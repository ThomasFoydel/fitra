import React from 'react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import ManageSession from './ManageSession'
import axios from '__mocks__/axios'
import Store from 'context/Store'

const exampleUser = { id: '123' }

describe('Trainer settings page', () => {
  jest.mock('axios')

  beforeEach(async () => {
    axios.get.mockReturnValue(
      Promise.resolve({
        data: {
          foundSession: {
            id: '222',
            endTime: new Date(),
            startTime: new Date(),
          },
          foundClient: { id: '111', name: 'john doe' },
        },
      })
    )

    axios.delete = jest.fn((url, req) => {
      if (req.headers.id === exampleUser.id && url === '/api/trainer/cancel-session/') {
        return Promise.resolve({ data: { success: true } })
      }
    })

    render(
      <Store>
        <Router>
          <ManageSession match={{ params: { id: exampleUser.id } }} />
        </Router>
      </Store>
    )
    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1))
  })
  
  afterEach(cleanup)

  it('Should have three links ', async () => {
    const links = screen.getAllByRole('link')
    expect(links.length).toEqual(3)
  })

  it('Should have one button that says "cancel session"', async () => {
    const btn = screen.getByRole('button')
    expect(btn.textContent).toEqual('cancel session')
  })

  it('Should make a delete request when cancel and confirm buttons are clicked"', async () => {
    const btn = screen.getByRole('button')

    jest.spyOn(axios, 'delete')

    userEvent.click(btn)
    const secondSetOfBtns = screen.getAllByRole('button')
    const confirmBtn = secondSetOfBtns[1]
    userEvent.click(confirmBtn)
    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1))
    expect(axios.delete).toHaveBeenCalledTimes(1)
  })
})
