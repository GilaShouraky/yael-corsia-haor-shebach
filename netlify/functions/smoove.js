exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const SMOOVE_API_KEY = '2b930959-167d-45ec-989d-29b63173fc50';
    const SMOOVE_LIST_ID = 1117962;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + SMOOVE_API_KEY,
    };

    // Create contact
    const createRes = await fetch('https://rest.smoove.io/v1/Contacts?updateIfExists=true', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        cellPhone: data.cellPhone,
      }),
    });
    const contactId = JSON.parse(await createRes.text()).id;
    console.log('Contact ID:', contactId);

    // Try all methods on Lists endpoint
    for (const method of ['POST', 'PUT', 'PATCH']) {
      const res = await fetch(`https://rest.smoove.io/v1/Lists/${SMOOVE_LIST_ID}/Contacts`, {
        method,
        headers,
        body: JSON.stringify([contactId]),
      });
      const text = await res.text();
      console.log(`${method} Lists/Contacts:`, res.status, text.substring(0, 100));
    }

    // Also try with contact ID in URL
    for (const method of ['POST', 'PUT', 'PATCH']) {
      const res = await fetch(`https://rest.smoove.io/v1/Lists/${SMOOVE_LIST_ID}/Contacts/${contactId}`, {
        method,
        headers,
      });
      const text = await res.text();
      console.log(`${method} Lists/Contacts/id:`, res.status, text.substring(0, 100));
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, body: err.message };
  }
};
