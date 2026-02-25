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
    const createText = await createRes.text();
    console.log('Create:', createRes.status, createText.substring(0, 200));

    let contactId;
    try { contactId = JSON.parse(createText).id; } catch(e) {}
    console.log('Contact ID:', contactId);

    if (!contactId) {
      return { statusCode: 500, body: 'No contact ID: ' + createText };
    }

    // Step 2: Add to list via dedicated endpoint
    const addRes = await fetch(`https://rest.smoove.io/v1/Lists/${SMOOVE_LIST_ID}/Contacts`, {
      method: 'PUT',
      headers,
      body: JSON.stringify([contactId]),
    });
    const addText = await addRes.text();
    console.log('Add to list:', addRes.status, addText);

    return { statusCode: 200, body: JSON.stringify({ success: true, contactId }) };
  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, body: err.message };
  }
};
