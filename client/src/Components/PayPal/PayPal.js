import React, { useEffect, useRef } from 'react';
import {
  PayPalScriptProvider,
  PayPalButtons,
  usePayPalScriptReducer,
} from '@paypal/react-paypal-js';
import './PayPal.scss';
import loading from 'imgs/loading/loading-dots.gif';

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
            <Buttons handleResolve={handleResolve} handleError={handleError} />
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  );
};

export default PayPal;

const Buttons = ({ handleError, handleResolve }) => {
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();

  return (
    <div className=''>
      {isPending && <img src={loading} alt='loading' />}
      <PayPalButtons
        style={{ layout: 'vertical' }}
        onApprove={handleResolve}
        onError={handleError}
      />
    </div>
  );
};
