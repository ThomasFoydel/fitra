import axios from 'axios'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import React, { useState } from 'react'
import AuthPageToggle from './AuthPageToggle'

const Register = ({ props: { setCurrentShow, setAuthOpen, trainer } }) => {
  const [userForm, setUserForm] = useState({})

  const handleChange = ({ target: { id, value } }) => setUserForm({ ...userForm, [id]: value })

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post(`/api/${trainer ? 'trainer' : 'client'}/register`, userForm)
      .then(() => setCurrentShow('login'))
      .catch(({ response: { data } }) => toast.error(data.message))
  }

  const stopBubble = (e) => e.stopPropagation()

  return (
    <form className="register" onSubmit={handleSubmit} onClick={stopBubble}>
      <button type="button" className="closeauth-btn" onClick={() => setAuthOpen(false)}>
        <i className="fas fa-times fa-3x close-btn" />
      </button>
      <h2>{trainer && 'Trainer '}Register</h2>
      <input id="name" type="text" placeholder="name" onChange={handleChange} />
      <input id="email" type="text" placeholder="email" onChange={handleChange} />
      <input id="password" type="password" placeholder="password" onChange={handleChange} />
      <input
        type="password"
        id="confirmpassword"
        onChange={handleChange}
        placeholder="confirm password"
      />
      <p>
        by registering, you agree to our{' '}
        <a target="_blank" href="/terms-of-use">
          Terms Of Use
        </a>
      </p>
      <p>
        and our{' '}
        <a target="_blank" href="/privacy-policy">
          Privacy Policy
        </a>
      </p>
      <button className="submit-btn" type="submit">
        Submit
      </button>
      <button type="button" className="signin-btn" onClick={() => setCurrentShow('login')}>
        I already have an account
      </button>
      <AuthPageToggle />
    </form>
  )
}

Register.propTypes = {
  props: PropTypes.shape({
    trainer: PropTypes.bool.isRequired,
    setAuthOpen: PropTypes.func.isRequired,
    setCurrentShow: PropTypes.func.isRequired,
  }),
}

export default Register
