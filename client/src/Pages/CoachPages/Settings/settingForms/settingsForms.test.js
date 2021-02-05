import React from 'react';
import Active from './Active';
import RateEditor from './RateEditor';
import tagEditor from './tagEditor';
import userEvent from '@testing-library/user-event';
import mockedAxios from '__mocks__/axios';
import {
  render,
  screen,
  cleanup,
  getByText,
  waitFor,
} from '@testing-library/react';
import axios from '__mocks__/axios';

describe('Trainer settings active form', () => {
  const defaultProps = {
    onError: () => {},
    type: 'trainer',
    onComplete: jest.fn,
    token: '123',
    active: true,
  };

  beforeEach(() => {
    render(<Active props={defaultProps} />);
  });
  afterEach(cleanup);

  it('Should set checkbox to initial props', () => {
    const checkbox = screen.getByTestId('active-btn');
    expect(checkbox.checked).toEqual(true);
  });

  it('Should have a header that says Active', () => {
    const heading = screen.getByRole('heading');
    expect(heading.textContent).toEqual('Active');
  });
  it('Should send axios post request when checkbox clicked', async () => {
    jest.mock('axios');
    const checkbox = screen.getByTestId('active-btn');
    jest.spyOn(mockedAxios, 'post');

    jest.mock('axios');
    axios.post.mockReturnValue(
      Promise.resolve({
        data: {
          active: defaultProps.active,
        },
      })
    );

    userEvent.click(checkbox);
    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });
});
