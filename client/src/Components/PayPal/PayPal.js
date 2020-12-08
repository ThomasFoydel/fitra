import React, { useEffect, useRef } from 'react';
import './PayPal.scss';

const PayPal = ({ props: { complete, desc, price, setPayPalOpen } }) => {
  const paypal = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          console.log({ data, err });
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                description: desc,
                amount: {
                  currency_code: 'USD',
                  value: price,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          complete(order);
        },
        onError: (err) => {
          console.log({ err });
        },
      })
      .render(paypal.current);
  }, [complete, desc, price]);
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
          <div ref={paypal}></div>
        </div>
      </div>
    </div>
  );
};

export default PayPal;
