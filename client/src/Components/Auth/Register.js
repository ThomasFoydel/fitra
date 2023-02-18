import axios from 'axios'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import React, { useState } from 'react'
import AuthPageToggle from './AuthPageToggle'

const Register = ({ props: { setCurrentShow, setAuthOpen, trainer } }) => {
  const [userForm, setUserForm] = useState({})

  const handleChange = ({ target: { id, value } }) => setUserForm({ ...userForm, [id]: value })

  const handleSubmit = () => {
    axios
      .post(`/api/${trainer ? 'trainer' : 'client'}/register`, userForm)
      .then(() => setCurrentShow('login'))
      .catch(({ data: { response } }) => toast.error(response.message))
  }

  const handleKeyDown = (e) => e.charCode === 13 && handleSubmit()

  return (
    <div className="register">
      <button className="closeauth-btn" onClick={() => setAuthOpen(false)}>
        <i className="fas fa-times fa-3x close-btn"></i>
      </button>
      <h2>{trainer && 'Trainer '}Register</h2>
      <input id="name" type="text" placeholder="name" onChange={handleChange} />
      <input
        id="email"
        type="text"
        placeholder="email"
        onChange={handleChange}
        onKeyPress={handleKeyDown}
      />
      <input
        id="password"
        type="password"
        placeholder="password"
        onChange={handleChange}
        onKeyPress={handleKeyDown}
      />
      <input
        type="password"
        id="confirmpassword"
        onChange={handleChange}
        onKeyPress={handleKeyDown}
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
      <button className="submit-btn" onClick={handleSubmit}>
        Submit
      </button>
      <button className="signin-btn" onClick={() => setCurrentShow('login')}>
        I already have an account
      </button>
      <AuthPageToggle />
    </div>
  )
}

Register.propTypes = {
  props: PropTypes.shape({
    trainer: PropTypes.object.isRequired,
    setAuthOpen: PropTypes.func.isRequired,
    setCurrentShow: PropTypes.func.isRequired,
  }),
}

export default Register
