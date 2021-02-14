import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter as Router } from 'react-router-dom';

import axios from '__mocks__/axios';
import Store from 'context/Store';
import Settings from './Settings';

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
  afterEach(cleanup);
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
    jest.spyOn(axios, 'put');

    axios.put.mockReturnValue(
      Promise.resolve({
        data: {
          active: true,
        },
      })
    );
    userEvent.click(checkbox);
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
    expect(axios.put).toHaveBeenCalledTimes(1);
    expect(checkbox.checked).toEqual(true);
  });

  it('Should have three links to terms of use, privacy policy, and delete account', () => {
    const links = screen.getAllByRole('link');
    expect(links[0].textContent).toEqual('terms of use');
    expect(links[1].textContent).toEqual('privacy policy');
    expect(links[2].textContent).toEqual('delete my account');
  });

  it('Should change the tags after API call after a user clicks add tag button', async () => {
    jest.mock('axios');
    const input = screen.getByTestId('tag-editor-input');
    const addTagBtn = screen.getByTestId('add-tag-btn');
    jest.spyOn(axios, 'put');

    axios.put.mockReturnValue(
      Promise.resolve({
        data: ['yoga'],
      })
    );

    userEvent.type(input, 'yoga');
    userEvent.click(addTagBtn);
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
    expect(axios.put).toHaveBeenCalledTimes(1);
    const tags = screen.getAllByTestId('tag');
    expect(tags.length).toEqual(1);
    expect(tags[0].textContent).toEqual('yoga');
  });

  it('Should change the rate after API call after user clicks rate submit button', async () => {
    jest.mock('axios');
    const input = screen.getByTestId('rate-editor-input');
    const btn = screen.getByTestId('rate-editor-btn');
    jest.spyOn(axios, 'put');

    axios.put.mockReturnValue(
      Promise.resolve({
        data: {
          rate: 39,
        },
      })
    );

    userEvent.type(input, '39');
    userEvent.click(btn);
    await waitFor(() => expect(axios.put).toHaveBeenCalledTimes(1));
    expect(axios.put).toHaveBeenCalledTimes(1);
    const display = screen.getByTestId('rate-display');
    expect(display.textContent).toEqual('$39');
  });
});
