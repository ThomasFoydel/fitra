import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { render, screen, cleanup } from '@testing-library/react'
import LandingPage from './LandingPage'
import Store from 'context/Store'

describe('Client landing page', () => {
  beforeEach(() => {
    render(
      <Store>
        <Router>
          <LandingPage />
        </Router>
      </Store>
    )
  })

  afterEach(cleanup)

  it('Should have two links', () => {
    const links = screen.getAllByRole('link')
    expect(links.length).toEqual(2)
  })

  it('Should have a link to the trainers search page that says "Get Started"', () => {
    const startLink = screen.getByText('Get Started')
    expect(startLink.href).toEqual('http://localhost/trainers')
  })

  it('Should have a link to the trainer landing page that says "Coach Portal"', () => {
    const coachPortalLink = screen.getByText('Coach Portal')
    expect(coachPortalLink.href).toEqual('http://localhost/coachportal')
  })

  it('Should have a header that says "Sharpen Your Body"', () => {
    const heading = screen.getByRole('heading')
    expect(heading.innerHTML).toEqual('SHARPEN<br>YOUR BODY')
  })
})
