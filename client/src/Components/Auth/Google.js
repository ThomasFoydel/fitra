import React, { useState } from 'react';
import { GoogleLogin } from 'react-google-login';
import PropTypes from 'prop-types';

const Google = ({
  props: { googleHandleSuccess, googleHandleError, googleErr },
}) => {
  const [hover, setHover] = useState(false);

  return (
    <div onMouseOver={() => setHover(true)} onMouseOut={() => setHover(false)}>
      <GoogleLogin
        clientId='1034940197721-bs2c0n1opcqmdlcumn3c1bubrm3ga77k.apps.googleusercontent.com'
        onSuccess={googleHandleSuccess}
        onFailure={googleHandleError}
        cookiePolicy={'single_host_origin'}
        render={(renderProps) => (
          <button
            onClick={googleErr ? null : renderProps.onClick}
            disabled={renderProps.disabled}
            className='google-btn'
          >
            {googleErr && hover ? (
              <span
                className='nocookies'
                style={{
                  fontSize: '1rem',
                  lineHeight: '1.2rem',
                  whiteSpace: 'nowrap',
                  width: '20rem',
                }}
              >
                Must enable third party cookies
              </span>
            ) : (
              <span style={{ fontSize: "'1.2rem'" }}>LOGIN WITH GOOGLE</span>
            )}
          </button>
        )}
      ></GoogleLogin>
    </div>
  );
};

Google.propTypes = {
  props: PropTypes.shape({
    googleHandleSuccess: PropTypes.func.isRequired,
    googleHandleError: PropTypes.func.isRequired,
    googleErr: PropTypes.func.isRequired,
  }),
};

export default Google;
