import React from 'react';
import Settings from './Settings';
import { render, screen, getByRole, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Store from 'context/Store';
import { BrowserRouter as Router } from 'react-router-dom';
import mockedAxios from '__mocks__/axios';
import axios from '__mocks__/axios';

describe('Trainer settings page', () => {
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

  it('Should have a header that says Settings', () => {
    const heading = screen.getAllByRole('heading')[0];
    expect(heading.textContent).toEqual('Settings');
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('Should have inputs', () => {
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('Should change checkbox checked to true in response to API call when active button is clicked', async () => {
    jest.mock('axios');
    const checkbox = screen.getByTestId('active-btn');
    jest.spyOn(mockedAxios, 'post');

    jest.mock('axios');
    axios.post.mockReturnValue(
      Promise.resolve({
        data: {
          active: true,
        },
      })
    );
    userEvent.click(checkbox);
    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(checkbox.checked).toEqual(true);
  });
});
