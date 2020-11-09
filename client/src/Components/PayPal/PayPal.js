import React, { useEffect, useRef } from 'react';

const PayPal = () => {
  // const [checkout, setCheckOut] = useState(false);

  const paypal = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: function (data, actions) {
          return fetch('/demo/checkout/api/paypal/order/create/', {
            method: 'post',
          })
            .then(function (res) {
              return res.json();
            })
            .then(function (orderData) {
              return orderData.id;
            });
        },
        onApprove: function (data, actions) {
          return fetch(
            '/demo/checkout/api/paypal/order/' + data.orderID + '/capture/',
            {
              method: 'post',
            }
          )
            .then(function (res) {
              return res.json();
            })
            .then(function (orderData) {
              // Three cases to handle:
              //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
              //   (2) Other non-recoverable errors -> Show a failure message
              //   (3) Successful transaction -> Show a success / thank you message

              // Your server defines the structure of 'orderData', which may differ
              var errorDetail =
                Array.isArray(orderData.details) && orderData.details[0];

              if (errorDetail && errorDetail.issue === 'INSTRUMENT_DECLINED') {
                // Recoverable state, see: "Handle Funding Failures"
                // https://developer.paypal.com/docs/checkout/integration-features/funding-failure/
                return actions.restart();
              }

              if (errorDetail) {
                var msg = 'Sorry, your transaction could not be processed.';
                if (errorDetail.description)
                  msg += '\n\n' + errorDetail.description;
                if (orderData.debug_id) msg += ' (' + orderData.debug_id + ')';
                // Show a failure message
                return alert(msg);
              }

              // Show a success message to the buyer
              alert(
                'Transaction completed by ' + orderData.payer.name.given_name
              );
            });
        },
        onError: (err) => {
          console.log({ err });
        },
      })
      .render(paypal.current);
  }, []);
  return (
    <div className='paypal-container'>
      <div ref={paypal}></div>
      {/* {checkout ? <PayPal/> : <button onClick={()=>setCheckOut(true)}>checkout</button> } */}
    </div>
  );
};

export default PayPal;
