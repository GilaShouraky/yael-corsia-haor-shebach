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

    // Step 1: Create contact (without list)
    const contactRes = await fetch('https://rest.smoove.io/v1/Contacts?updateIfExists=true', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        cellPhone: data.cellPhone,
      }),
    });
    const contactData = await contactRes.json();
    const contactId = contactData.id;
    console.log('Contact ID:', contactId);

    // Step 2: Add contact to list via PATCH
    const patchRes = await fetch(`https://rest.smoove.io/v1/Contacts/${contactId}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({
        lists_Linked: [SMOOVE_LIST_ID],
      }),
    });
    const patchText = await patchRes.text();
    console.log('PATCH result:', patchRes.status, patchText);

    // Step 3: Also try dedicated list endpoint
    const listRes = await fetch(`https://rest.smoove.io/v1/Lists/${SMOOVE_LIST_ID}/Contacts/${contactId}`, {
      method: 'PUT',
      headers,
    });
    const listText = await listRes.text();
    console.log('List endpoint:', listRes.status, listText);

    return { statusCode: 200, body: JSON.stringify({ success: true, contactId }) };
  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, body: err.message };
  }
};
