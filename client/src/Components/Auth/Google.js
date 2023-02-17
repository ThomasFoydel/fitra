import PropTypes from 'prop-types'
import React, { useState } from 'react'
import { GoogleLogin } from '@leecheuk/react-google-login'

const Google = ({ props: { googleHandleSuccess, googleHandleError, googleErr } }) => {
  const [hover, setHover] = useState(false)

  return (
    <div onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
      <GoogleLogin
        onFailure={googleHandleError}
        onSuccess={googleHandleSuccess}
        cookiePolicy={'single_host_origin'}
        clientId="1034940197721-bs2c0n1opcqmdlcumn3c1bubrm3ga77k.apps.googleusercontent.com"
        render={renderProps => (
          <button
            className="google-btn"
            disabled={renderProps.disabled}
            onClick={googleErr ? null : renderProps.onClick}
          >
            {googleErr && hover ? (
              <span
                className="nocookies"
                style={{
                  width: '20rem',
                  fontSize: '1rem',
                  lineHeight: '1.2rem',
                  whiteSpace: 'nowrap',
                }}
              >
                Must enable third party cookies
              </span>
            ) : (
              <span style={{ fontSize: "'1.2rem'" }}>LOGIN WITH GOOGLE</span>
            )}
          </button>
        )}
      />
    </div>
  )
}

Google.propTypes = {
  props: PropTypes.shape({
    googleErr: PropTypes.bool.isRequired,
    googleHandleError: PropTypes.func.isRequired,
    googleHandleSuccess: PropTypes.func.isRequired,
  }),
}

export default Google
