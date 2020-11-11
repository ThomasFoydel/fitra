import React, { useEffect, useRef } from 'react';
import './PayPal.scss';

const PayPal = ({ props: { complete, desc, price, setPayPalOpen } }) => {
  // const [checkout, setCheckOut] = useState(false);

  const paypal = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
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
  }, []);
  return (
    <div className='paypal-background'>
      <div className='paypal-container'>
        <div className='paypal'>
          <i
            onClick={() => setPayPalOpen(false)}
            className='fas fa-times fa-3x close-btn'
          ></i>
          <div ref={paypal}></div>
        </div>
        {/* {checkout ? <PayPal/> : <button onClick={()=>setCheckOut(true)}>checkout</button> } */}
      </div>
    </div>
  );
};

export default PayPal;
