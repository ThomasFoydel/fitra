import axios from 'axios'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import React, { useState, useContext } from 'react'
import AuthPageToggle from './AuthPageToggle'
import { CTX } from 'context/Store'
// import Facebook from './Facebook'
// import Google from './Google'

const Login = ({ props: { setCurrentShow, setAuthOpen, trainer } }) => {
  const [, updateState] = useContext(CTX)
  const [userForm, setUserForm] = useState({})
  // const [googleErr, setGoogleErr] = useState(false)

  const handleChange = ({ target: { id, value } }) => setUserForm({ ...userForm, [id]: value })

  const type = trainer ? 'trainer' : 'client'

  const handleSubmit = (e) => {
    e.preventDefault()
    axios
      .post(`/api/${type}/login`, userForm)
      .then(({ data: { user, token } }) => updateState({ type: 'LOGIN', payload: { user, token } }))
      .catch(({ response: { data } }) => toast.error(data.message))
  }

  // const fbResponse = ({ accessToken, userID }) => {
  //   if (!accessToken || !userID) return toast.error('One or more fields missing')
  //   axios
  //     .post(`/api/${type}/fblogin`, { accessToken, userID })
  //     .then(({ data: { token, user } }) => updateState({ type: 'LOGIN', payload: { user, token } }))
  //     .catch(({ response: { data } }) => toast.error(data.message))
  // }

  // const googleHandleSuccess = (response) => {
  //   const { tokenId } = response
  //   axios
  //     .post(`/api/${type}/googlelogin`, { tokenId })
  //     .then(({ data: { token, user } }) => updateState({ type: 'LOGIN', payload: { user, token } }))
  //     .catch(({ response: { data } }) => toast.error(data.message))
  // }

  return (
    <form className="login" onSubmit={handleSubmit}>
      <button type="button" className="closeauth-btn" onClick={() => setAuthOpen(false)}>
        <i className="fas fa-times fa-3x close-btn"></i>
      </button>
      <h2>{trainer && 'Trainer '}Login</h2>
      <input id="email" type="text" placeholder="email" onChange={handleChange} />
      <input id="password" type="password" placeholder="password" onChange={handleChange} />
      <p className="tos">
        by logging in, you agree to our{' '}
        <a target="_blank" href="/terms-of-use">
          Terms Of Use
        </a>
      </p>
      <p className="pp">
        and our{' '}
        <a target="_blank" href="/privacy-policy">
          Privacy Policy
        </a>
      </p>
      <button className="submit-btn" type="submit">
        Login
      </button>

      {/* {!trainer && (
        <>
          <Facebook props={{ callback: fbResponse }} />
          <Google props={{ googleHandleSuccess, googleHandleError:() => setGoogleErr(true), googleErr }} />
        </>
      )} */}

      <button className="signup-btn" type="button" onClick={() => setCurrentShow('register')}>
        No account? <strong>Sign up</strong>
      </button>
      <AuthPageToggle />
    </form>
  )
}

Login.propTypes = {
  props: PropTypes.shape({
    trainer: PropTypes.bool.isRequired,
    setAuthOpen: PropTypes.func.isRequired,
    setCurrentShow: PropTypes.func.isRequired,
  }),
}

export default Login
