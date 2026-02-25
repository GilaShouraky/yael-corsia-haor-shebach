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

    // Step 1: Search for existing contact by email
    const searchRes = await fetch('https://rest.smoove.io/v1/Contacts?email=' + encodeURIComponent(data.email), {
      method: 'GET',
      headers,
    });
    const searchText = await searchRes.text();
    console.log('Search:', searchRes.status, searchText);

    let contactId = null;
    try {
      const searchData = JSON.parse(searchText);
      contactId = Array.isArray(searchData) ? searchData[0]?.id : searchData?.id;
    } catch(e) {}

    if (contactId) {
      // Contact exists - add to list via PUT
      const putRes = await fetch('https://rest.smoove.io/v1/Contacts/' + contactId, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          id: contactId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          cellPhone: data.cellPhone,
          lists_Linked: [SMOOVE_LIST_ID],
        }),
      });
      const putText = await putRes.text();
      console.log('PUT existing:', putRes.status, putText);
    } else {
      // New contact - create with list
      const createRes = await fetch('https://rest.smoove.io/v1/Contacts', {
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
      const createText = await createRes.text();
      console.log('Create new:', createRes.status, createText);
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, body: err.message };
  }
};
