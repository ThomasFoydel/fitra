import React from 'react';
// import Settings from './Settings';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Store from 'context/Store';
import { BrowserRouter as Router } from 'react-router-dom';
import mockedAxios from '__mocks__/axios';
import axios from '__mocks__/axios';
import ManageSession from './ManageSession';

describe('Trainer settings page', () => {
  jest.mock('axios');

  beforeEach(async () => {
    axios.get.mockReturnValue(
      Promise.resolve({
        data: {
          foundClient: { id: '111', name: 'john doe' },
          foundSession: {
            id: '222',
            startTime: new Date(),
            endTime: new Date(),
          },
        },
      })
    );
    axios.post.mockReturnValue(
      Promise.resolve({
        data: {
          id: '123',
        },
      })
    );

    render(
      <Store>
        <Router>
          <ManageSession match={{ params: { id: '123' } }} />
        </Router>
      </Store>
    );
    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
  });
  afterEach(cleanup);

  it('Should have three links ', async () => {
    const links = screen.getAllByRole('link');
    expect(links.length).toEqual(3);
  });

  it('Should have one button that says "cancel session"', async () => {
    const btn = screen.getByRole('button');
    expect(btn.textContent).toEqual('cancel session');
  });

  it('Should make a post request when cancel and confirm buttons are clicked"', async () => {
    const btn = screen.getByRole('button');

    jest.spyOn(mockedAxios, 'post');

    userEvent.click(btn);
    const secondSetOfBtns = screen.getAllByRole('button');
    const confirmBtn = secondSetOfBtns[1];
    userEvent.click(confirmBtn);
    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });
});
