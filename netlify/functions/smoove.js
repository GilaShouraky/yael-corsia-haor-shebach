exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const SMOOVE_API_KEY = '50f2b9e9-534f-49d5-8dc4-2b05ec90039c';
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

    const contactData = await contactRes.json();
    console.log('Contact upsert:', contactRes.status, JSON.stringify(contactData));

    const contactId = contactData.id;
    if (!contactId) {
      return { statusCode: 500, body: 'No contact ID returned' };
    }

    // Step 2: Add contact to list
    const listRes = await fetch('https://rest.smoove.io/v1/Lists/' + SMOOVE_LIST_ID + '/Contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify([contactId]),
    });

    const listText = await listRes.text();
    console.log('Add to list:', listRes.status, listText);

    return {
      statusCode: 200,
      body: JSON.stringify({ contact: contactId, list: listRes.status }),
    };
  } catch (err) {
    console.error('Smoove error:', err);
    return { statusCode: 500, body: err.message };
  }
};
