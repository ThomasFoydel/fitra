import React, { useEffect, useRef } from 'react';
import './PayPal.scss';

const PayPal = ({ props: { complete, desc, price } }) => {
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
        <div ref={paypal}></div>
        {/* {checkout ? <PayPal/> : <button onClick={()=>setCheckOut(true)}>checkout</button> } */}
      </div>
    </div>
  );
};

export default PayPal;
