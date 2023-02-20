import React from 'react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter as Router } from 'react-router-dom'
import { render, screen, waitFor, cleanup } from '@testing-library/react'
import axios from '__mocks__/axios'
import Store from 'context/Store'
import Delete from './Delete'

const mockReq = {
  password: 'passwordString',
  url: '/api/user/delete_my_account/client',
}

describe('Delete account page', () => {
  jest.mock('axios')
  beforeEach(async () => {
    axios.delete = jest.fn((url, body) => {
      if (url === mockReq.url && body.headers.pass === mockReq.password)
        return Promise.resolve({ data: { status: 'success' } })
    })
    render(
      <Store>
        <Router>
          <Delete />
        </Router>
      </Store>
    )
  })

  afterEach(cleanup)

  it('Should send a delete request with password when delete flow is completed', async () => {
    const deleteBtn = screen.getByRole('button')
    userEvent.click(deleteBtn)
    const [, confirmBtn] = screen.getAllByRole('button')
    userEvent.click(confirmBtn)
    const realDeleteBtn = screen.getByText('DELETE')
    const input = await screen.getByTestId('delete-password-input')
    userEvent.type(input, mockReq.password)
    userEvent.click(realDeleteBtn)
    await waitFor(() => expect(axios.delete).toHaveBeenCalledTimes(1))
  })

  it('Should contain a link to /settings', () => {
    const link = screen.getByRole('link')
    expect(link.href).toEqual('http://localhost/settings')
  })

  it('Should have a button that says "delete my account"', () => {
    const btn = screen.getByRole('button')
    expect(btn.textContent).toEqual('delete my account')
  })
})
