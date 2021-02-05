import React from 'react';
import Settings from './Settings';
import { render, screen, getByRole } from '@testing-library/react';
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
});
