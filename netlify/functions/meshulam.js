exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const orderData = JSON.parse(event.body);
    const { customer, items, totalAmount, shipping } = orderData;

    const USER_ID = '4ec1d595ae764243';
    const PAGE_CODE = '2e33827fed97255316271140423c04c8';
    const API_URL = 'https://api.grow.link/api/light/server/1.0/CreatePaymentLink';

    const productNames = items.map(i => i.name).join(', ');

    const formData = new URLSearchParams();
    formData.append('userId', USER_ID);
    formData.append('pageCode', PAGE_CODE);
    formData.append('paymentLinkType', '2');
    formData.append('isActive', '1');
    formData.append('sendingMode', '1');
    formData.append('title', 'האור שבך');
    formData.append('messageText', 'תודה שקנית מהאור שבך!');
    formData.append('transactionType[0]', '1');
    formData.append('transactionType[1]', '6');
    formData.append('transactionType[2]', '13');
    formData.append('transactionType[3]', '14');
    formData.append('transactionType[4]', '15');
    formData.append('transactionType[5]', '5');
    formData.append('paymentTypes[0][type]', 'payments');
    formData.append('paymentTypes[0][payments][paymentsPaymentNum]', '1');
    formData.append('paymentTypes[0][payments][paymentsMaxPaymentNum]', '12');
    formData.append('pageFieldSettings[fullName][value]', `${customer.firstName} ${customer.lastName}`);
    formData.append('pageFieldSettings[phone][value]', customer.phone);
    formData.append('pageFieldSettings[email][value]', customer.email);
    formData.append('pageFieldSettings[invoiceName][isRequired]', 'true');
    formData.append('products[data][0][name]', productNames);
    formData.append('products[data][0][price]', totalAmount);
    formData.append('products[data][0][vatType]', '3');

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'accept': 'application/json' },
      body: formData,
    });

    const data = await response.json();
    console.log('Meshulam response:', JSON.stringify(data));

    if (data.data && data.data.link) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, url: data.data.link }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: false, error: data.message || 'שגיאה ביצירת קישור תשלום' }),
    };

  } catch (err) {
    console.error('Meshulam error:', err);
    return { statusCode: 500, body: JSON.stringify({ success: false, error: err.message }) };
  }
};