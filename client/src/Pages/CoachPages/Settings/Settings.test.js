import React from 'react';
import Settings from './Settings';
import { render, screen } from '@testing-library/react';
import Store from 'context/Store';
import { BrowserRouter as Router } from 'react-router-dom';

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

  it('Should have an h2 header', () => {
    render(
      <Store>
        <Router>
          <Settings />
        </Router>
      </Store>
    );
    expect(screen.getByRole('heading')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('Should have inputs', () => {
    render(
      <Store>
        <Router>
          <Settings />
        </Router>
      </Store>
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});
