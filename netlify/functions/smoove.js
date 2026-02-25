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

    // Step 1: Create or update contact
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

    const contactText = await contactRes.text();
    console.log('Contact raw:', contactRes.status, contactText);

    let contactId;
    try {
      const contactData = JSON.parse(contactText);
      contactId = contactData.id;
    } catch (e) {
      console.error('Could not parse contact response:', contactText);
      return { statusCode: 500, body: 'Could not parse contact: ' + contactText };
    }

    if (!contactId) {
      return { statusCode: 500, body: 'No contact ID' };
    }

    // Step 2: PATCH to add list
    const patchRes = await fetch('https://rest.smoove.io/v1/Contacts/' + contactId, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ lists_Linked: [SMOOVE_LIST_ID] }),
    });
    const patchText = await patchRes.text();
    console.log('PATCH:', patchRes.status, patchText);

    // Step 3: PUT to list endpoint
    const listRes = await fetch('https://rest.smoove.io/v1/Lists/' + SMOOVE_LIST_ID + '/Contacts/' + contactId, {
      method: 'PUT',
      headers,
    });
    const listText = await listRes.text();
    console.log('List PUT:', listRes.status, listText);

    return { statusCode: 200, body: JSON.stringify({ success: true, contactId }) };
  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, body: err.message };
  }
};
