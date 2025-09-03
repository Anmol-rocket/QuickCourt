import React, { useState } from "react";
import { CreditCard, Lock, X } from "lucide-react";
import styles from "./StripePaymentModal.module.css";

const StripePaymentModal = ({
  isOpen,
  onClose,
  refundAmount,
  refundId,
  customerEmail,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: {
      line1: "",
      city: "",
      state: "",
      postalCode: "",
      country: "US",
    },
  });
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\D/g, "");
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const validateCard = () => {
    const newErrors = {};

    if (
      !paymentData.cardNumber ||
      paymentData.cardNumber.replace(/\s/g, "").length < 16
    ) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    if (!paymentData.expiryDate || paymentData.expiryDate.length < 5) {
      newErrors.expiryDate = "Invalid expiry date";
    }

    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = "CVV must be 3-4 digits";
    }

    if (!paymentData.cardholderName.trim()) {
      newErrors.cardholderName = "Cardholder name is required";
    }

    if (!paymentData.billingAddress.line1.trim()) {
      newErrors.billingAddress = "Billing address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    if (field === "cardNumber") {
      value = formatCardNumber(value);
    } else if (field === "expiryDate") {
      value = formatExpiryDate(value);
    } else if (field === "cvv") {
      value = value.replace(/\D/g, "").substring(0, 4);
    }

    setPaymentData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleAddressChange = (field, value) => {
    setPaymentData((prev) => ({
      ...prev,
      billingAddress: {
        ...prev.billingAddress,
        [field]: value,
      },
    }));

    if (errors.billingAddress) {
      setErrors((prev) => ({ ...prev, billingAddress: null }));
    }
  };

  const processPayment = async () => {
    if (!validateCard()) return;

    setProcessing(true);

    try {
      // Simulate payment processing
      console.log("Processing Stripe refund payment...", {
        amount: refundAmount,
        refundId,
        customerEmail,
        card: {
          number: paymentData.cardNumber.replace(/\s/g, ""),
          exp: paymentData.expiryDate,
          cvc: paymentData.cvv,
          name: paymentData.cardholderName,
        },
        billing: paymentData.billingAddress,
      });

      // Mock payment processing delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock payment success (90% success rate for demo)
      const success = Math.random() > 0.1;

      if (success) {
        const paymentResult = {
          paymentIntentId: `pi_mock_${Date.now()}`,
          amount: refundAmount,
          currency: "usd",
          status: "succeeded",
          charges: {
            data: [
              {
                id: `ch_mock_${Date.now()}`,
                amount: Math.round(parseFloat(refundAmount) * 100),
                currency: "usd",
                status: "succeeded",
              },
            ],
          },
          created: Math.floor(Date.now() / 1000),
        };

        console.log("Mock payment successful:", paymentResult);
        onPaymentSuccess(paymentResult);
        onClose();
      } else {
        throw new Error(
          "Your card was declined. Please try a different payment method."
        );
      }
    } catch (error) {
      console.error("Payment failed:", error);
      onPaymentError(error.message || "Payment processing failed");
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <CreditCard size={24} />
            <div>
              <h2>Process Refund Payment</h2>
              <p>Amount: ${parseFloat(refundAmount).toFixed(2)}</p>
            </div>
          </div>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.securityNotice}>
            <Lock size={16} />
            <span>Your payment information is secure and encrypted</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              processPayment();
            }}
          >
            <div className={styles.formGroup}>
              <label>Card Number</label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={paymentData.cardNumber}
                onChange={(e) =>
                  handleInputChange("cardNumber", e.target.value)
                }
                maxLength={19}
                className={errors.cardNumber ? styles.error : ""}
              />
              {errors.cardNumber && (
                <span className={styles.errorText}>{errors.cardNumber}</span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Expiry Date</label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  value={paymentData.expiryDate}
                  onChange={(e) =>
                    handleInputChange("expiryDate", e.target.value)
                  }
                  maxLength={5}
                  className={errors.expiryDate ? styles.error : ""}
                />
                {errors.expiryDate && (
                  <span className={styles.errorText}>{errors.expiryDate}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label>CVV</label>
                <input
                  type="text"
                  placeholder="123"
                  value={paymentData.cvv}
                  onChange={(e) => handleInputChange("cvv", e.target.value)}
                  maxLength={4}
                  className={errors.cvv ? styles.error : ""}
                />
                {errors.cvv && (
                  <span className={styles.errorText}>{errors.cvv}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Cardholder Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={paymentData.cardholderName}
                onChange={(e) =>
                  handleInputChange("cardholderName", e.target.value)
                }
                className={errors.cardholderName ? styles.error : ""}
              />
              {errors.cardholderName && (
                <span className={styles.errorText}>
                  {errors.cardholderName}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Billing Address</label>
              <input
                type="text"
                placeholder="123 Main St"
                value={paymentData.billingAddress.line1}
                onChange={(e) => handleAddressChange("line1", e.target.value)}
                className={errors.billingAddress ? styles.error : ""}
              />
              {errors.billingAddress && (
                <span className={styles.errorText}>
                  {errors.billingAddress}
                </span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="City"
                  value={paymentData.billingAddress.city}
                  onChange={(e) => handleAddressChange("city", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="State"
                  value={paymentData.billingAddress.state}
                  onChange={(e) => handleAddressChange("state", e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <input
                  type="text"
                  placeholder="ZIP Code"
                  value={paymentData.billingAddress.postalCode}
                  onChange={(e) =>
                    handleAddressChange("postalCode", e.target.value)
                  }
                />
              </div>
            </div>

            <div className={styles.mockDataHelper}>
              <h4>Use Mock Test Data:</h4>
              <button
                type="button"
                onClick={() => {
                  setPaymentData({
                    cardNumber: "4242 4242 4242 4242",
                    expiryDate: "12/25",
                    cvv: "123",
                    cardholderName: "Test User",
                    billingAddress: {
                      line1: "123 Test Street",
                      city: "Test City",
                      state: "TS",
                      postalCode: "12345",
                      country: "US",
                    },
                  });
                }}
                className={styles.fillTestDataBtn}
              >
                Fill Test Data
              </button>
            </div>

            <div className={styles.modalActions}>
              <button
                type="button"
                onClick={onClose}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={processing}
                className={styles.processBtn}
              >
                {processing ? (
                  <>
                    <div className={styles.spinner}></div>
                    Processing...
                  </>
                ) : (
                  `Process $${parseFloat(refundAmount).toFixed(2)} Refund`
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StripePaymentModal;
