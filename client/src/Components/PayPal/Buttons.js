import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import loading from 'imgs/loading/loading-dots.gif';
import PropTypes from 'prop-types';

const Buttons = ({ handleError, handleResolve, price }) => {
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer();

  return (
    <div className=''>
      {isPending && <img src={loading} alt='loading' />}
      <PayPalButtons
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: price,
                },
              },
            ],
          });
        }}
        style={{ layout: 'vertical' }}
        onApprove={handleResolve}
        onError={handleError}
      />
    </div>
  );
};

export default Buttons;

Buttons.propTypes = {
  props: PropTypes.shape({
    handleError: PropTypes.func.isRequired,
    handleResolve: PropTypes.func.isRequired,
    price: PropTypes.string.isRequired,
  }),
};
