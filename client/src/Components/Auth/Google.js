import React from 'react';
import { GoogleLogin } from 'react-google-login';

const Google = ({ props: { googleSuccess, googleError } }) => {
  return (
    <GoogleLogin
      clientId='1034940197721-bs2c0n1opcqmdlcumn3c1bubrm3ga77k.apps.googleusercontent.com'
      onSuccess={googleSuccess}
      onFailure={googleError}
      cookiePolicy={'single_host_origin'}
      render={(renderProps) => (
        <button
          onClick={renderProps.onClick}
          disabled={renderProps.disabled}
          className='google-btn'
        >
          <span>LOGIN WITH GOOGLE</span>
        </button>
      )}
    ></GoogleLogin>
  );
};

export default Google;
