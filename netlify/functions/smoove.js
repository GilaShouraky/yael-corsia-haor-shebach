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

    const contactData = await contactRes.json();
    console.log('Contact upsert:', contactRes.status, contactData.id);

    const contactId = contactData.id;
    if (!contactId) {
      return { statusCode: 500, body: 'No contact ID returned' };
    }

    // Step 2: PUT to update the specific contact with new list
    const putRes = await fetch('https://rest.smoove.io/v1/Contacts/' + contactId, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        lists_Linked: [...(contactData.lists_Linked || []), SMOOVE_LIST_ID],
      }),
    });
    const putText = await putRes.text();
    console.log('PUT contact:', putRes.status, putText);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, contactId }),
    };
  } catch (err) {
    console.error('Smoove error:', err);
    return { statusCode: 500, body: err.message };
  }
};
