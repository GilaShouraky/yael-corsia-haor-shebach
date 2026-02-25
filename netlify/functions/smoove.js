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

    // Step 1: Search by email
    const searchRes = await fetch('https://rest.smoove.io/v1/Contacts?email=' + encodeURIComponent(data.email), {
      method: 'GET',
      headers,
    });
    const searchData = JSON.parse(await searchRes.text());
    const contacts = Array.isArray(searchData) ? searchData : [searchData];
    const match = contacts.find(c => c.email?.toLowerCase() === data.email.toLowerCase());
    console.log('Match:', match?.id, 'lists:', match?.lists_Linked);

    let contactId = match?.id;

    if (contactId) {
      // Use lists from search result (more reliable than GET)
      const currentLists = match.lists_Linked || [];
      const newLists = [...new Set([...currentLists, SMOOVE_LIST_ID])];
      console.log('Sending lists:', newLists);

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
      const putData = JSON.parse(await putRes.text());
      console.log('PUT result lists:', putData.lists_Linked);
    } else {
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
      console.log('Created:', createRes.status);
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, body: err.message };
  }
};
