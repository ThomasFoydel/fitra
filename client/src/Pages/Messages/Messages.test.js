import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';

import Store from 'context/Store';
import Messages from './Messages';

describe('Client landing page', () => {
  beforeEach(() => {
    render(
      <Store>
        <Messages />
      </Store>
    );
  });
  afterEach(cleanup);
  it('Should have a button that says "send"', () => {
    screen.getByText('send');
  });

  it('Should display "no messages" be default', () => {
    screen.getByText('no messages');
  });
});
