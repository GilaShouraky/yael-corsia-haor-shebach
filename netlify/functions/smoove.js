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

    // Step 1: Search by email and filter results
    const searchRes = await fetch('https://rest.smoove.io/v1/Contacts?email=' + encodeURIComponent(data.email), {
      method: 'GET',
      headers,
    });
    const searchText = await searchRes.text();
    const searchData = JSON.parse(searchText);

    // Find exact match by email
    const contacts = Array.isArray(searchData) ? searchData : [searchData];
    const match = contacts.find(c => c.email?.toLowerCase() === data.email.toLowerCase());
    console.log('Match found:', match?.id, match?.email);

    let contactId = match?.id;

    if (contactId) {
      // Step 2: GET current lists for this contact
      const getRes = await fetch('https://rest.smoove.io/v1/Contacts/' + contactId, {
        method: 'GET',
        headers,
      });
      const getContact = await getRes.json();
      const currentLists = getContact.lists_Linked || [];
      console.log('Current lists:', currentLists);

      // Step 3: PUT with merged lists
      const newLists = [...new Set([...currentLists, SMOOVE_LIST_ID])];
      const putRes = await fetch('https://rest.smoove.io/v1/Contacts/' + contactId, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          id: contactId,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          cellPhone: data.cellPhone,
          lists_Linked: newLists,
        }),
      });
      const putText = await putRes.text();
      console.log('PUT result:', putRes.status, putText);
    } else {
      // New contact
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
      console.log('Created:', createRes.status, createText);
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, body: err.message };
  }
};
