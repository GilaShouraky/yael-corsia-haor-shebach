exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const orderData = JSON.parse(event.body);

    const payload = {
      cid: process.env.ICOUNT_CID,
      user: process.env.ICOUNT_USER,
      pass: process.env.ICOUNT_PASS,
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
    };

    const response = await fetch('https://api.icount.co.il/api/v3.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('iCount response:', JSON.stringify(data));

    if (data.status !== true && data.status !== 'true') {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: false, error: data.msg || data.error || 'התשלום נכשל' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        transactionId: data.transaction_id || data.doc_id,
        documentId: data.doc_id,
        documentUrl: data.doc_url,
      }),
    };
  } catch (err) {
    console.error('iCount error:', err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};
