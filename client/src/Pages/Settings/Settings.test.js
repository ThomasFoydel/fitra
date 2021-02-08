import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';

import axios from '__mocks__/axios';
import Store from 'context/Store';
import Settings from './Settings';

describe('Client settings page', () => {
  it('Should render settings page', () => {
    render(
      <Store>
        <Router>
          <Settings />
        </Router>
      </Store>
    );
  });

  beforeEach(() => {
    render(
      <Store>
        <Router>
          <Settings />
        </Router>
      </Store>
    );
  });
  afterEach(cleanup);
  it('Should have a header that says Settings', () => {
    const heading = screen.getAllByRole('heading')[0];
    expect(heading.textContent).toEqual('Settings');
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('Should change checkbox checked to true in response to API call when darkmode button is clicked', async () => {
    jest.mock('axios');
    const checkbox = screen.getByTestId('darkmode-btn');
    jest.spyOn(axios, 'post');

    axios.post.mockReturnValue(
      Promise.resolve({
        data: {
          darkmode: true,
        },
      })
    );
    userEvent.click(checkbox);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(checkbox.checked).toEqual(true);
  });

  it('Should have three links to terms of use, privacy policy, and delete account', () => {
    const links = screen.getAllByRole('link');
    expect(links[0].textContent).toEqual('terms of use');
    expect(links[1].textContent).toEqual('privacy policy');
    expect(links[2].textContent).toEqual('delete my account');
  });
});
