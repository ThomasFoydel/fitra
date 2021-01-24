import React, { useEffect, useRef } from 'react';
import { PayPalScriptProvider } from '@paypal/react-paypal-js';
import PropTypes from 'prop-types';
import Buttons from './Buttons';
import './PayPal.scss';

const PayPal = ({ props: { complete, desc, price, setPayPalOpen } }) => {
  const handleResolve = (e) => {
    complete(e);
  };
  const handleError = (e) => {
    console.log('REJECT: ', e);
  };

  return (
    <div className='paypal-background'>
      <div className='paypal-container'>
        <div className='paypal'>
          <i
            onClick={() => setPayPalOpen(false)}
            className='fas fa-times fa-3x close-btn'
          ></i>
          <p>test email: sb-7ub213671568@personal.example.com</p>
          <p>{`test password: %)z6>&Ry`}</p>

          <PayPalScriptProvider options={{ 'client-id': 'sb' }}>
            <Buttons
              price={price}
              handleResolve={handleResolve}
              handleError={handleError}
            />
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
};

export default PayPal;

PayPal.propTypes = {
  props: PropTypes.shape({
    complete: PropTypes.func.isRequired,
    desc: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    setPayPalOpen: PropTypes.func.isRequired,
  }),
};
