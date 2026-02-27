// ICountService.js
// Payment service for iCount integration

// iCount API Configuration
const ICOUNT_CONFIG = {
  cid: import.meta.env.VITE_ICOUNT_CID,
  user: import.meta.env.VITE_ICOUNT_USER,
  pass: import.meta.env.VITE_ICOUNT_PASS,
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
    // Step 1: Charge credit card via iCount
    const chargeResponse = await fetch(ICOUNT_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        cid: ICOUNT_CONFIG.cid,
        user: ICOUNT_CONFIG.user,
        pass: ICOUNT_CONFIG.pass,
        action: 'charge_card',
        cc_number: orderData.payment.cardNumber,
        cc_holder_name: orderData.payment.cardHolder,
        cc_exp_month: orderData.payment.expiryMonth,
        cc_exp_year: '20' + orderData.payment.expiryYear,
        cvv: orderData.payment.cvv,
        sum: orderData.totalAmount,
        description: orderData.items.map(i => i.name).join(', '),
        client_name: orderData.customer.firstName + ' ' + orderData.customer.lastName,
        client_email: orderData.customer.email,
        client_phone: orderData.customer.phone,
        client_id: orderData.customer.idNumber,
        create_doc: 1,
        doc_type: 'receipt',
        send_client_email: 1,
      }),
    });

    const chargeData = await chargeResponse.json();
    console.log('iCount response:', chargeData);

    if (chargeData.status !== true && chargeData.status !== 'true') {
      return {
        success: false,
        error: chargeData.msg || chargeData.error || 'התשלום נכשל',
      };
    }

    return {
      success: true,
      transactionId: chargeData.transaction_id || chargeData.doc_id,
      documentId: chargeData.doc_id,
      documentUrl: chargeData.doc_url,
      message: 'התשלום בוצע בהצלחה',
    };

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
      const success = true;

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