import React from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import Buttons from './Buttons'
import './PayPal.scss'

const PayPal = ({ props: { complete, desc, price, setPayPalOpen } }) => {
  const handleResolve = (e) => complete(e)

  const handleError = (e) => toast.error(e)

  return (
    <div className="paypal-background">
      <div className="paypal-container">
        <div className="paypal">
          <i onClick={() => setPayPalOpen(false)} className="fas fa-times fa-3x close-btn"></i>
          <div className="test">
            <p>test email: sb-7ub213671568@personal.example.com</p>
            <p>{`test password: %)z6>&Ry`}</p>
          </div>
          <PayPalScriptProvider options={{ 'client-id': 'sb' }}>
            <Buttons props={{ price, handleError, handleResolve }} />
          </PayPalScriptProvider>
        </div>
      </div>
    </div>
  )
}

export default PayPal

PayPal.propTypes = {
  props: PropTypes.shape({
    desc: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    complete: PropTypes.func.isRequired,
    setPayPalOpen: PropTypes.func.isRequired,
  }),
}
