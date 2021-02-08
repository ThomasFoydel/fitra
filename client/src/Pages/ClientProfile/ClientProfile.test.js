import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';

import axios from '__mocks__/axios';
import Store from 'context/Store';
import ClientProfile from './ClientProfile';

const exampleUser = {
  name: 'bert',
  displayEmail: 'beart@bertmail.com',
  bio: 'i am bert',
  profilePic: '12345678',
  coverPic: 'abcdefg',
  _id: '123',
};

describe('Trainer home page', () => {
  jest.mock('axios');
  beforeEach(async () => {
    axios.get = jest.fn((url, body) => {
      if (url === `/api/client/profile/${exampleUser._id}`) {
        return Promise.resolve({
          data: {
            foundUser: exampleUser,
          },
        });
      }
    });
    render(
      <Store>
        <ClientProfile match={{ params: { id: exampleUser._id } }} />
      </Store>
    );

    await waitFor(() => expect(axios.get).toHaveBeenCalledTimes(1));
  });
  afterEach(cleanup);

  it('Should display client info after GET request', () => {
    screen.getByText(exampleUser.name);
    screen.getByText(exampleUser.bio);
    screen.getByText(exampleUser.displayEmail);
  });

  it('Should display loading spinner initially', () => {
    const img = screen.getByRole('img');
    expect(img.src).toEqual('http://localhost/spin.gif');
  });
});
