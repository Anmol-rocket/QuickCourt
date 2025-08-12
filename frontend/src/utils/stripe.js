import { loadStripe } from '@stripe/stripe-js';

// Mock Stripe publishable key for testing
// In production, this should be stored in environment variables
// Using Stripe's test publishable key format
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';

// Mock Stripe instance for testing
// For actual implementation, use your real Stripe publishable key
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

// Mock payment methods for testing
export const mockPaymentMethods = [
  {
    id: 'card_visa_success',
    type: 'card',
    card: {
      brand: 'visa',
      last4: '4242',
      exp_month: 12,
      exp_year: 2028,
    },
    billing_details: {
      name: 'Test User',
    }
  },
  {
    id: 'card_mastercard_success',
    type: 'card',
    card: {
      brand: 'mastercard',
      last4: '5555',
      exp_month: 10,
      exp_year: 2027,
    },
    billing_details: {
      name: 'Test User',
    }
  }
];

// Mock payment processing function
export const processPayment = async (amount, paymentMethodId = 'card_visa_success') => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock success/failure logic
  const isSuccess = Math.random() > 0.1; // 90% success rate
  
  if (isSuccess) {
    return {
      success: true,
      paymentIntent: {
        id: `pi_mock_${Date.now()}`,
        amount: amount * 100, // Stripe uses cents
        currency: 'inr',
        status: 'succeeded',
        created: Date.now(),
        payment_method: paymentMethodId,
      },
      message: 'Payment processed successfully'
    };
  } else {
    throw new Error('Your card was declined. Please try again with a different payment method.');
  }
};

// Mock Stripe Elements options
export const stripeElementsOptions = {
  mode: 'payment',
  currency: 'inr',
  amount: 1000, // This will be updated dynamically
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#48A6A7',
      colorBackground: '#ffffff',
      colorText: '#424770',
      colorDanger: '#df1b41',
      fontFamily: 'system-ui, sans-serif',
      spacingUnit: '4px',
      borderRadius: '6px',
    },
  },
};
