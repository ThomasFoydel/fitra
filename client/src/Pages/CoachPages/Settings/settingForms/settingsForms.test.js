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

describe('Trainer settings active form', () => {
  const defaultProps = {
    onError: () => {},
    type: 'trainer',
    onComplete: () => {},
    token: '123',
    active: false,
  };

  it('Should render active form', () => {
    render(<Active props={defaultProps} />);
  });

  beforeEach(() => {
    render(<Active props={defaultProps} />);
  });
  afterEach(cleanup);

  it('Should send axios post request when checkbox clicked', async () => {
    const checkbox = screen.getByTestId('active-btn');
    jest.spyOn(mockedAxios, 'post');
    userEvent.click(checkbox);
    await waitFor(() => expect(mockedAxios.post).toHaveBeenCalledTimes(1));
    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
  });
});
