import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { render, screen, waitFor, cleanup } from '@testing-library/react';

import axios from '__mocks__/axios';
import Store from 'context/Store';
import TrainerHome from './TrainerHome';

const today = new Date();

const todayPlusHalfHr = new Date();
todayPlusHalfHr.setMinutes(todayPlusHalfHr.getMinutes() + 30);

const exampleSession = {
  active: true,
  startTime: today,
  endTime: todayPlusHalfHr,
  _id: '123',
  client: 'abc',
};

describe('Trainer home page', () => {
  jest.mock('axios');
  beforeEach(async () => {
    axios.get.mockReturnValue(
      Promise.resolve({
        data: {
          sessions: [exampleSession],
        },
      })
    );
    render(
      <Store>
        <Router>
          <TrainerHome />
        </Router>
      </Store>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  });
  afterEach(cleanup);
  it('Should have a title that says "Sessions"', async () => {
    await screen.findByText('Sessions');
    await screen.getAllByRole('heading');
  });

  it('Should display session information after receiving data from get request', async () => {
    const start = await screen.findByTestId('trainer-home-session-start');
    expect(start.textContent).toEqual(
      `${today.toDateString()} ${today.toLocaleTimeString()}`
    );

    const end = await screen.findByTestId('trainer-home-session-end');
    expect(end.textContent).toEqual(
      `${todayPlusHalfHr.toDateString()} ${todayPlusHalfHr.toLocaleTimeString()}`
    );
  });

  it('Should have link to the profile of client and to connect page on active sessions', () => {
    const link = screen.getAllByRole('link');
    expect(link[0].href).toEqual(
      `http://localhost/user/${exampleSession.client}`
    );
    expect(link[1].href).toEqual(
      `http://localhost/connect/${exampleSession._id}`
    );
  });
});
