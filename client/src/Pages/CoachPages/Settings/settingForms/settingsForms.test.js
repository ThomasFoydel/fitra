import React from 'react'
import userEvent from '@testing-library/user-event'
import { render, screen, cleanup, waitFor } from '@testing-library/react'
import RateEditor from './RateEditor'
import TagEditor from './TagEditor'
import axios from '__mocks__/axios'
import Store from 'context/Store'
import Active from './Active'

describe('Trainer settings active form', () => {
  const defaultProps = {
    onError: () => {},
    type: 'trainer',
    onComplete: jest.fn,
    token: '123',
    active: true,
  }

  beforeEach(() => {
    render(<Active props={defaultProps} />)
  })

  afterEach(cleanup)

  it('Should set checkbox to initial props', () => {
    const checkbox = screen.getByTestId('active-btn')
    expect(checkbox.checked).toEqual(true)
  })

  it('Should have a header that says Active', () => {
    const heading = screen.getByRole('heading')
    expect(heading.textContent).toEqual('Active')
  })

  it('Should send axios put request when checkbox clicked', async () => {
    jest.mock('axios')
    const checkbox = screen.getByTestId('active-btn')
    jest.spyOn(axios, 'put')

    axios.put.mockReturnValue(
      Promise.resolve({
        data: {
          active: defaultProps.active,
        },
      })
    )

    userEvent.click(checkbox)
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1))
    expect(axios.put).toHaveBeenCalledTimes(1)
  })
})

describe('Trainer settings tag form', () => {
  beforeEach(() =>
    render(
      <Store>
        <TagEditor />
      </Store>
    )
  )

  afterEach(cleanup)

  it('Should have a button that says "add tag"', () => {
    const btn = screen.getByRole('button')
    expect(btn.textContent).toEqual('add tag')
  })

  it('Should fire a put request when the button is clicked and input has value', async () => {
    jest.mock('axios')
    const btn = screen.getByRole('button')
    const input = screen.getByRole('textbox')
    userEvent.type(input, 'newtag')
    jest.spyOn(axios, 'put')

    axios.put.mockReturnValue(
      Promise.resolve({
        data: {
          tags: ['mma', 'boxing', 'yoga'],
        },
      })
    )
    userEvent.click(btn)
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1))
    expect(axios.put).toHaveBeenCalledTimes(1)
  })

  it('Should NOT fire a put request when the button is clicked and input has no value', async () => {
    jest.mock('axios')
    const btn = screen.getByRole('button')
    jest.spyOn(axios, 'put')

    axios.put.mockReturnValue(
      Promise.resolve({
        data: {
          tags: ['mma', 'boxing', 'yoga'],
        },
      })
    )

    userEvent.click(btn)
    expect(axios.put).toHaveBeenCalledTimes(0)
  })
})

describe('Trainer settings rate form', () => {
  const defaultProps = {
    id: '123',
    rate: 40,
    onComplete: jest.fn,
    onError: jest.fn,
    token: '123',
  }

  beforeEach(() => render(<RateEditor props={defaultProps} />))

  afterEach(cleanup)

  it('Should have a controlled number input', () => {
    const numberInput = screen.getByRole('spinbutton')
    expect(numberInput.value).toEqual('40')
  })

  it('Should have a button that says "update"', () => {
    const btn = screen.getByRole('button')
    expect(btn.textContent).toEqual('update')
  })

  it('Should display the rate as a dollar amount', () => {
    const display = screen.getByTestId('rate-display')
    expect(display.innerHTML).toEqual('$40')
  })

  it('Should fire a post request when the button is clicked', async () => {
    jest.mock('axios')
    const btn = screen.getByRole('button')
    jest.spyOn(axios, 'put')

    axios.put.mockReturnValue(
      Promise.resolve({
        data: {
          rate: 40,
        },
      })
    )

    userEvent.click(btn)
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1))
    expect(axios.put).toHaveBeenCalledTimes(1)
  })
})
