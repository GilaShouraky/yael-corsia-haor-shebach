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
        lists_Linked: [SMOOVE_LIST_ID],
      }),
    });

    const contactData = await contactRes.json();
    console.log('Contact upsert:', contactRes.status, JSON.stringify(contactData));

    const contactId = contactData.id;
    if (!contactId) {
      return { statusCode: 500, body: 'No contact ID returned' };
    }

    // Step 2: Update contact to include the new list (merge with existing lists)
    const existingLists = contactData.lists_Linked || [];
    if (!existingLists.includes(SMOOVE_LIST_ID)) {
      const updatedLists = [...existingLists, SMOOVE_LIST_ID];
      const updateRes = await fetch('https://rest.smoove.io/v1/Contacts?updateIfExists=true', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: data.email,
          lists_Linked: updatedLists,
        }),
      });
      const updateText = await updateRes.text();
      console.log('Update lists:', updateRes.status, updateText);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, contactId }),
    };
  } catch (err) {
    console.error('Smoove error:', err);
    return { statusCode: 500, body: err.message };
  }
};
