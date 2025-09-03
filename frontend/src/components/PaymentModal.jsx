import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise, processPayment, mockPaymentMethods } from '../utils/stripe';
import Receipt from './Receipt';
import styles from './PaymentModal.module.css';

// Payment form component
const PaymentForm = ({ amount, onPaymentSuccess, onPaymentError, onCancel, bookingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mock'); // 'mock' or 'stripe'
  const [selectedMockCard, setSelectedMockCard] = useState(mockPaymentMethods[0]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    try {
      if (paymentMethod === 'mock') {
        // Use mock payment processing
        const result = await processPayment(amount, selectedMockCard.id);
        onPaymentSuccess(result);
      } else {
        // Use real Stripe processing (commented out for mock)
        /*
        if (!stripe || !elements) {
          throw new Error('Stripe not loaded');
        }

        const cardElement = elements.getElement(CardElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardElement,
        });

        if (error) {
          throw error;
        }

        const result = await processPayment(amount, paymentMethod.id);
        onPaymentSuccess(result);
        */
        
        // For now, use mock even when "stripe" is selected
        const result = await processPayment(amount, 'card_stripe_mock');
        onPaymentSuccess(result);
      }
    } catch (error) {
      onPaymentError(error.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className={styles.paymentForm}>
      <div className={styles.paymentHeader}>
        <h3>Payment Information</h3>
        <div className={styles.securityBadge}>
          <span className={styles.lockIcon}>🔒</span>
          <span>Secure Payment</span>
        </div>
      </div>

      {/* Booking Summary */}
      <div className={styles.bookingSummary}>
        <h4>Booking Summary</h4>
        <div className={styles.summaryItem}>
          <span>Venue:</span>
          <span>{bookingDetails.venueName}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Sport:</span>
          <span>{bookingDetails.sportName}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Date:</span>
          <span>{bookingDetails.date}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Time:</span>
          <span>{bookingDetails.startTime} - {bookingDetails.endTime}</span>
        </div>
        <div className={styles.summaryItem}>
          <span>Duration:</span>
          <span>{bookingDetails.duration}</span>
        </div>
        <div className={`${styles.summaryItem} ${styles.totalAmount}`}>
          <span>Total Amount:</span>
          <span>₹{amount.toFixed(2)}</span>
        </div>
      </div>

      {/* Payment Method Selection */}
      <div className={styles.paymentMethodSelector}>
        <h4>Select Payment Method</h4>
        <div className={styles.methodOptions}>
          <label className={styles.methodOption}>
            <input
              type="radio"
              name="paymentMethod"
              value="mock"
              checked={paymentMethod === 'mock'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className={styles.methodLabel}>
              <span className={styles.methodIcon}>💳</span>
              Mock Payment (Test Mode)
            </span>
          </label>
          <label className={styles.methodOption}>
            <input
              type="radio"
              name="paymentMethod"
              value="stripe"
              checked={paymentMethod === 'stripe'}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <span className={styles.methodLabel}>
              <span className={styles.methodIcon}>🔒</span>
              Stripe Payment (Demo)
            </span>
          </label>
        </div>
      </div>

      <form onSubmit={handleSubmit} className={styles.paymentFormContent}>
        {paymentMethod === 'mock' ? (
          <div className={styles.mockPayment}>
            <h4>Select Test Card</h4>
            <div className={styles.mockCards}>
              {mockPaymentMethods.map((card) => (
                <label key={card.id} className={styles.mockCard}>
                  <input
                    type="radio"
                    name="mockCard"
                    value={card.id}
                    checked={selectedMockCard.id === card.id}
                    onChange={() => setSelectedMockCard(card)}
                  />
                  <div className={styles.cardInfo}>
                    <span className={styles.cardBrand}>{card.card.brand.toUpperCase()}</span>
                    <span className={styles.cardNumber}>•••• •••• •••• {card.card.last4}</span>
                    <span className={styles.cardExpiry}>{card.card.exp_month}/{card.card.exp_year}</span>
                  </div>
                </label>
              ))}
            </div>
            <div className={styles.mockNote}>
              <span className={styles.infoIcon}>ℹ️</span>
              <span>This is a test payment. No real money will be charged.</span>
            </div>
          </div>
        ) : (
          <div className={styles.stripePayment}>
            <div className={styles.cardElementContainer}>
              <label className={styles.cardLabel}>Card Information</label>
              <div className={styles.cardElement}>
                <CardElement
                  options={{
                    style: {
                      base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                          color: '#aab7c4',
                        },
                      },
                      invalid: {
                        color: '#9e2146',
                      },
                    },
                  }}
                />
              </div>
            </div>
            <div className={styles.stripeNote}>
              <span className={styles.infoIcon}>ℹ️</span>
              <span>Use test card 4242 4242 4242 4242 with any future date and CVC.</span>
            </div>
          </div>
        )}

        <div className={styles.paymentActions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            disabled={processing}
          >
            Cancel
          </button>
          <button
            type="submit"
            className={styles.payButton}
            disabled={processing}
          >
            {processing ? (
              <>
                <span className={styles.spinner}></span>
                Processing...
              </>
            ) : (
              <>Pay ₹{amount.toFixed(2)}</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Main payment wrapper component with Stripe Elements provider
const PaymentModal = ({ isOpen, amount, onPaymentSuccess, onPaymentError, onCancel, bookingDetails }) => {
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentData, setPaymentData] = useState(null);

  const handlePaymentSuccess = (result) => {
    setPaymentData(result);
    setShowReceipt(true);
    // Don't call onPaymentSuccess immediately, wait for receipt to be closed
  };

  const handleReceiptClose = () => {
    setShowReceipt(false);
    setPaymentData(null);
    onPaymentSuccess(paymentData); // Now call the original success handler
  };

  if (!isOpen) return null;

  // Show receipt if payment was successful
  if (showReceipt && paymentData) {
    return (
      <Receipt 
        paymentData={paymentData} 
        bookingDetails={bookingDetails} 
        onClose={handleReceiptClose}
      />
    );
  }

  return (
    <div className={styles.paymentModal}>
      <div className={styles.paymentModalContent}>
        <Elements stripe={stripePromise}>
          <PaymentForm
            amount={amount}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentError={onPaymentError}
            onCancel={onCancel}
            bookingDetails={bookingDetails}
          />
        </Elements>
      </div>
    </div>
  );
};

export default PaymentModal;
