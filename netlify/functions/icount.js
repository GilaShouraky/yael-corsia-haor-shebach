exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const orderData = JSON.parse(event.body);
    const BASE = 'https://api.icount.co.il/api/v3.php';

    const toForm = (obj) => new URLSearchParams(obj).toString();

    // Step 1: Login to get session ID
    const loginRes = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: toForm({
        cid: process.env.ICOUNT_CID,
        user: process.env.ICOUNT_USER,
        pass: process.env.ICOUNT_PASS,
      }),
    });
    const loginData = await loginRes.json();
    console.log('Login:', loginData.status, loginData.sid ? 'got sid' : loginData.reason);

    if (!loginData.status) {
      return { statusCode: 200, body: JSON.stringify({ success: false, error: 'iCount login failed: ' + loginData.reason }) };
    }

    const sid = loginData.sid;

    // Step 2: Charge credit card
    const chargeRes = await fetch(`${BASE}/cc/charge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: toForm({
        sid,
        cc_number: orderData.payment.cardNumber.replace(/\s/g, ''),
        cc_holder_name: orderData.payment.cardHolder,
        cc_exp_month: orderData.payment.expiryMonth,
        cc_exp_year: '20' + orderData.payment.expiryYear,
        cvv: orderData.payment.cvv,
        sum: orderData.totalAmount,
        description: orderData.items.map(i => i.name).join(', '),
        client_name: orderData.customer.firstName + ' ' + orderData.customer.lastName,
        client_email: orderData.customer.email,
        client_phone: orderData.customer.phone,
        create_doc: 1,
        doc_type: 'receipt',
        send_client_email: 1,
      }),
    });
    const chargeData = await chargeRes.json();
    console.log('Charge:', JSON.stringify(chargeData));

    // Logout
    await fetch(`${BASE}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: toForm({ sid }),
    });

    if (!chargeData.status) {
      return { statusCode: 200, body: JSON.stringify({ success: false, error: chargeData.error_description || chargeData.reason || 'התשלום נכשל' }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        transactionId: chargeData.transaction_id || chargeData.doc_id,
        documentId: chargeData.doc_id,
        documentUrl: chargeData.doc_url,
      }),
    };
  } catch (err) {
    console.error('iCount error:', err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
