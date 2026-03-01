// ICountService.js
// Payment service for iCount integration

// iCount API Configuration
const ICOUNT_CONFIG = {
  apiKey: import.meta.env.VITE_ICOUNT_API_KEY || 'YOUR_API_KEY_HERE',
  companyId: import.meta.env.VITE_ICOUNT_COMPANY_ID || 'YOUR_COMPANY_ID',
  userId: import.meta.env.VITE_ICOUNT_USER_ID || 'YOUR_USER_ID',
  apiEndpoint: 'https://api.icount.co.il/api/v3.php',
};

/**
 * Validate credit card number using Luhn algorithm
 */
export const validateCardNumber = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) {
    return false;
  }

  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
};

/**
 * Validate CVV
 */
export const validateCVV = (cvv) => {
  return /^\d{3,4}$/.test(cvv);
};

/**
 * Validate expiry date
 */
export const validateExpiry = (month, year) => {
  if (!/^\d{2}$/.test(month) || !/^\d{2}$/.test(year)) {
    return false;
  }

  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10);

  if (expMonth < 1 || expMonth > 12) {
    return false;
  }

  const now = new Date();
  const currentYear = now.getFullYear() % 100;
  const currentMonth = now.getMonth() + 1;

  if (expYear < currentYear || (expYear === currentYear && expMonth < currentMonth)) {
    return false;
  }

  return true;
};

/**
 * Get card type from number
 */
export const getCardType = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(cleaned)) return 'Visa';
  if (/^5[1-5]/.test(cleaned)) return 'MasterCard';
  if (/^3[47]/.test(cleaned)) return 'American Express';
  if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
  if (/^2/.test(cleaned)) return 'Isracard';
  
  return 'Unknown';
};

/**
 * Process payment through iCount
 */
export const processICountPayment = async (orderData) => {
  try {
    // סליקה זמנית - הדמיה עד חיבור משולם
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      success: true,
      transactionId: 'SIM-' + Date.now(),
      message: 'התשלום בוצע בהצלחה',
    };

    /* 
    // UNCOMMENT AND UPDATE when you have iCount API credentials:
    
    // Step 1: Create document (invoice) in iCount
    const documentResponse = await fetch(ICOUNT_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cid: ICOUNT_CONFIG.companyId,
        user: ICOUNT_CONFIG.userId,
        pass: ICOUNT_CONFIG.apiKey,
        action: 'create_doc',
        type: 'invoice', // or 'receipt'
        client_name: `${orderData.customer.firstName} ${orderData.customer.lastName}`,
        client_email: orderData.customer.email,
        client_phone: orderData.customer.phone,
        client_id: orderData.customer.idNumber,
        items: orderData.items.map(item => ({
          description: item.name,
          quantity: item.quantity,
          price: item.salePrice || item.price,
        })),
        send_email: 1, // Send invoice by email
        send_sms: 1,   // Send SMS notification
      }),
    });

    const documentData = await documentResponse.json();

    if (documentData.status === 'error') {
      throw new Error(documentData.message || 'Failed to create document');
    }

    // Step 2: Process credit card payment
    const paymentResponse = await fetch(ICOUNT_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cid: ICOUNT_CONFIG.companyId,
        user: ICOUNT_CONFIG.userId,
        pass: ICOUNT_CONFIG.apiKey,
        action: 'charge_card',
        doc_id: documentData.doc_id,
        card_number: orderData.payment.cardNumber,
        card_holder: orderData.payment.cardHolder,
        card_expiry_month: orderData.payment.expiryMonth,
        card_expiry_year: orderData.payment.expiryYear,
        card_cvv: orderData.payment.cvv,
        installments: orderData.payment.installments,
        amount: orderData.totalAmount,
      }),
    });

    const paymentData = await paymentResponse.json();

    if (paymentData.status === 'error') {
      throw new Error(paymentData.message || 'Payment failed');
    }

    return {
      success: true,
      transactionId: paymentData.transaction_id,
      documentId: documentData.doc_id,
      documentUrl: documentData.doc_url,
      message: 'התשלום בוצע בהצלחה',
    };
    */

  } catch (error) {
    console.error('iCount payment error:', error);
    return {
      success: false,
      error: error.message || 'שגיאה בעיבוד התשלום',
    };
  }
};

/**
 * Verify payment status
 */
export const verifyICountPayment = async (transactionId) => {
  try {
    /* UNCOMMENT when you have iCount API:
    
    const response = await fetch(ICOUNT_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cid: ICOUNT_CONFIG.companyId,
        user: ICOUNT_CONFIG.userId,
        pass: ICOUNT_CONFIG.apiKey,
        action: 'get_transaction',
        transaction_id: transactionId,
      }),
    });

    const data = await response.json();
    
    return {
      success: data.status === 'success',
      status: data.payment_status, // 'completed', 'pending', 'failed'
      transaction: data,
    };
    */

    return {
      success: true,
      status: 'completed',
      transaction: { id: transactionId },
    };

  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Create refund
 */
export const refundICountPayment = async (transactionId, amount = null) => {
  try {
    /* UNCOMMENT when you have iCount API:
    
    const response = await fetch(ICOUNT_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cid: ICOUNT_CONFIG.companyId,
        user: ICOUNT_CONFIG.userId,
        pass: ICOUNT_CONFIG.apiKey,
        action: 'refund_transaction',
        transaction_id: transactionId,
        amount: amount, // null = full refund
      }),
    });

    const data = await response.json();
    
    return {
      success: data.status === 'success',
      refundId: data.refund_id,
    };
    */

    return {
      success: true,
      refundId: 'simulated-refund-id',
    };

  } catch (error) {
    console.error('Refund error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * SIMULATED payment for development
 * REMOVE THIS when you have real iCount API credentials
 */
const simulatePayment = (orderData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate 90% success rate
      const success = Math.random() > 0.1;

      if (success) {
        resolve({
          success: true,
          transactionId: 'SIM-' + Date.now(),
          documentId: 'DOC-' + Date.now(),
          documentUrl: 'https://example.com/invoice.pdf',
          message: 'התשלום בוצע בהצלחה (הדמיה)',
        });
      } else {
        resolve({
          success: false,
          error: 'התשלום נכשל - זוהי הדמיה בלבד',
        });
      }
    }, 2000); // Simulate 2 second processing
  });
};

export default {
  processICountPayment,
  verifyICountPayment,
  refundICountPayment,
  validateCardNumber,
  validateCVV,
  validateExpiry,
  getCardType,
};