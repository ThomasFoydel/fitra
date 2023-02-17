import React from 'react'
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js'
import loading from 'imgs/loading/loading-dots.gif'
import PropTypes from 'prop-types'

const Buttons = ({ props: { handleError, handleResolve, price } }) => {
  const [{ isPending, isResolved, isRejected }] = usePayPalScriptReducer()

  return (
    <div>
      {isPending && <img src={loading} alt="loading" />}
      <PayPalButtons
        onError={handleError}
        onApprove={handleResolve}
        style={{ layout: 'vertical' }}
        createOrder={(_, actions) =>
          actions.order.create({ purchase_units: [{ amount: { value: price } }] })
        }
      />
    </div>
  )
}

export default Buttons

Buttons.propTypes = {
  props: PropTypes.shape({
    price: PropTypes.string.isRequired,
    handleError: PropTypes.func.isRequired,
    handleResolve: PropTypes.func.isRequired,
  }),
}
