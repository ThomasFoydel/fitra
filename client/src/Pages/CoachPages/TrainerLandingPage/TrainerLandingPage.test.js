import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';

import Store from 'context/Store';
import TrainerLandingPage from './TrainerLandingPage';

describe('Trainer landing page', () => {
  beforeEach(async () => {
    render(
      <Store>
        <TrainerLandingPage />
      </Store>
    );
  });
  afterEach(cleanup);

  it('Should display a button that says "Get Started"', async () => {
    await screen.getByRole('button');
    await screen.getByText('Get Started');
  });

  it('Should have heading containing pitch text and button', () => {
    const heading = screen.getByRole('heading');
    expect(heading.innerHTML).toEqual(
      'STREAMLINE<br>YOUR<br>WORKFLOW<button>Get Started</button>'
    );
  });

  it('Should have an image', async () => {
    await screen.getByRole('img');
  });
});
