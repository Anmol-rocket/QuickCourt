import React, { useRef, useEffect, useState } from 'react';
import QRCode from 'qrcode';
import styles from './Receipt.module.css';

const Receipt = ({ paymentData, bookingDetails, onClose }) => {
  const receiptRef = useRef();
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');

  const downloadReceipt = () => {
    const receiptElement = receiptRef.current;
    const printWindow = window.open('', '_blank');
    
    // Create a complete HTML document for printing
    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Receipt - QuickCourt</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            
            body {
              font-family: 'Courier New', monospace;
              background: white;
              color: #000;
              padding: 20px;
            }
            
            .receipt {
              max-width: 400px;
              margin: 0 auto;
              background: white;
              border: 2px solid #000;
              padding: 20px;
            }
            
            .header {
              text-align: center;
              border-bottom: 2px solid #000;
              padding-bottom: 15px;
              margin-bottom: 20px;
            }
            
            .company-name {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            
            .company-tagline {
              font-size: 12px;
              margin-bottom: 10px;
            }
            
            .receipt-title {
              font-size: 18px;
              font-weight: bold;
              border: 1px solid #000;
              padding: 5px;
              margin-top: 10px;
            }
            
            .receipt-info {
              margin-bottom: 20px;
            }
            
            .info-row {
              display: flex;
              justify-content: space-between;
              margin-bottom: 8px;
              font-size: 14px;
            }
            
            .booking-details {
              border-top: 1px dashed #000;
              border-bottom: 1px dashed #000;
              padding: 15px 0;
              margin-bottom: 15px;
            }
            
            .section-title {
              font-weight: bold;
              font-size: 16px;
              margin-bottom: 10px;
              text-decoration: underline;
            }
            
            .payment-details {
              margin-bottom: 20px;
            }
            
            .amount-row {
              font-weight: bold;
              font-size: 16px;
              border-top: 1px solid #000;
              border-bottom: 2px solid #000;
              padding: 10px 0;
              margin-top: 10px;
            }
            
            .footer {
              text-align: center;
              border-top: 2px solid #000;
              padding-top: 15px;
              font-size: 12px;
            }
            
            .thank-you {
              font-weight: bold;
              margin-bottom: 10px;
            }
            
            .qr-placeholder {
              width: 80px;
              height: 80px;
              border: 2px solid #000;
              margin: 10px auto;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 10px;
            }
            
            @media print {
              body { padding: 0; }
              .receipt { border: none; }
            }
          </style>
        </head>
        <body>
          ${receiptElement.innerHTML}
        </body>
      </html>
    `;
    
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Generate QR code with booking details
  const generateQRCode = async () => {
    const qrData = {
      bookingId: paymentData.paymentIntent.id,
      venue: bookingDetails.venueName,
      court: bookingDetails.courtName,
      date: bookingDetails.date,
      timeSlot: bookingDetails.timeSlot,
      userName: bookingDetails.userName,
      amount: paymentData.paymentIntent.amount / 100,
      status: 'CONFIRMED'
    };

    const qrString = JSON.stringify(qrData);
    
    try {
      const qrCodeURL = await QRCode.toDataURL(qrString, {
        width: 200,
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeDataURL(qrCodeURL);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  // Download QR code as separate image
  const downloadQRCode = () => {
    if (qrCodeDataURL) {
      const link = document.createElement('a');
      link.download = `QuickCourt-QR-${paymentData.paymentIntent.id}.png`;
      link.href = qrCodeDataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  useEffect(() => {
    generateQRCode();
  }, []);

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: formatDate(now),
      time: formatTime(now)
    };
  };

  const currentDateTime = getCurrentDateTime();

  return (
    <div className={styles.receiptModal}>
      <div className={styles.receiptModalContent}>
        <div className={styles.receiptContainer}>
          <div ref={receiptRef} className={styles.receipt}>
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.companyName}>QUICKCOURT</div>
              <div className={styles.companyTagline}>Your Sports Booking Partner</div>
              <div className={styles.receiptTitle}>PAYMENT RECEIPT</div>
            </div>

            {/* Receipt Information */}
            <div className={styles.receiptInfo}>
              <div className={styles.infoRow}>
                <span>Receipt No:</span>
                <span>#{paymentData.paymentIntent.id.slice(-8).toUpperCase()}</span>
              </div>
              <div className={styles.infoRow}>
                <span>Date:</span>
                <span>{currentDateTime.date}</span>
              </div>
              <div className={styles.infoRow}>
                <span>Time:</span>
                <span>{currentDateTime.time}</span>
              </div>
              <div className={styles.infoRow}>
                <span>Payment ID:</span>
                <span>{paymentData.paymentIntent.id}</span>
              </div>
              <div className={styles.infoRow}>
                <span>Status:</span>
                <span style={{ fontWeight: 'bold' }}>PAID</span>
              </div>
            </div>

            {/* Booking Details */}
            <div className={styles.bookingDetails}>
              <div className={styles.sectionTitle}>BOOKING DETAILS</div>
              <div className={styles.infoRow}>
                <span>Venue:</span>
                <span>{bookingDetails.venueName}</span>
              </div>
              <div className={styles.infoRow}>
                <span>Sport:</span>
                <span>{bookingDetails.sportName}</span>
              </div>
              <div className={styles.infoRow}>
                <span>Date:</span>
                <span>{bookingDetails.date}</span>
              </div>
              <div className={styles.infoRow}>
                <span>Time:</span>
                <span>{bookingDetails.startTime} - {bookingDetails.endTime}</span>
              </div>
              <div className={styles.infoRow}>
                <span>Duration:</span>
                <span>{bookingDetails.duration}</span>
              </div>
            </div>

            {/* Payment Details */}
            <div className={styles.paymentDetails}>
              <div className={styles.sectionTitle}>PAYMENT DETAILS</div>
              <div className={styles.infoRow}>
                <span>Booking Fee:</span>
                <span>₹{(paymentData.paymentIntent.amount / 100).toFixed(2)}</span>
              </div>
              <div className={styles.infoRow}>
                <span>Platform Fee:</span>
                <span>₹0.00</span>
              </div>
              <div className={`${styles.infoRow} ${styles.amountRow}`}>
                <span>TOTAL PAID:</span>
                <span>₹{(paymentData.paymentIntent.amount / 100).toFixed(2)}</span>
              </div>
            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <div className={styles.thankYou}>Thank you for choosing QuickCourt!</div>
              <div>For support: support@quickcourt.com</div>
              <div>Call: +91-9876543210</div>
              
              {/* QR Code */}
              <div className={styles.qrContainer}>
                {qrCodeDataURL ? (
                  <img 
                    src={qrCodeDataURL} 
                    alt="Booking QR Code" 
                    className={styles.qrCode}
                  />
                ) : (
                  <div className={styles.qrPlaceholder}>
                    Loading QR...
                  </div>
                )}
                <div style={{ fontSize: '10px', marginTop: '5px' }}>
                  Scan for booking details
                </div>
              </div>
              
              <div style={{ fontSize: '10px', marginTop: '10px' }}>
                This is a computer generated receipt.
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.receiptActions}>
          <button 
            onClick={downloadReceipt} 
            className={styles.downloadButton}
          >
            📄 Download Receipt
          </button>
          <button 
            onClick={downloadQRCode} 
            className={styles.downloadButton}
            disabled={!qrCodeDataURL}
          >
            📱 Download QR Code
          </button>
          <button 
            onClick={onClose} 
            className={styles.closeButton}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
