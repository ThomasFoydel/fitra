import React from 'react';
import {
  render,
  screen,
  cleanup,
  waitFor,
  fireEvent,
} from '@testing-library/react';

import Store from 'context/Store';
import SessionReview from './SessionReview';
import userEvent from '@testing-library/user-event';
import axios from '__mocks__/axios';

const exampleSession = {
  id: '123',
};
const exampleReview = {
  rating: '3',
  comment:
    'great session, here are some more characters to meet the minimum of twenty',
};

describe('Session review page', () => {
  jest.mock('axios');

  beforeEach(() => {
    axios.post = jest.fn((url, body) => {
      if (
        url === `/api/client/review/${exampleSession.id}` &&
        body.rating === exampleReview.rating &&
        body.comment === exampleReview.comment
      )
        return Promise.resolve({
          data: {
            success: true,
          },
        });
    });
    render(
      <Store>
        <SessionReview match={{ params: { sessionId: exampleSession.id } }} />
      </Store>
    );
  });
  afterEach(cleanup);
  it('Should have a heading that says "Session Review"', () => {
    const heading = screen.getByRole('heading');
    expect(heading.textContent).toEqual('Session Review');
  });

  it('Should have a button that says "submit"', () => {
    const btn = screen.getByRole('button');
    expect(btn.textContent).toEqual('submit');
  });

  it('Should have a textarea that says "Leave your comments here..."', () => {
    const textarea = screen.getByRole('textbox');
    expect(textarea.placeholder).toEqual('Leave your comments here...');
  });

  it('Should send post request with rating and comment when button is clicked', async () => {
    const firstBtn = screen.getByRole('button');
    userEvent.click(firstBtn);
    const confirmBtn = screen.getByText('confirm');
    fireEvent.change(screen.getByTestId('select'), {
      target: { value: exampleReview.rating },
    });
    const comment = screen.getByRole('textbox');
    userEvent.type(comment, exampleReview.comment);
    userEvent.click(confirmBtn);
    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  });
});
