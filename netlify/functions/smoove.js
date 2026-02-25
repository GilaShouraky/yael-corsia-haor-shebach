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

    // Use AsyncContacts to add contact directly to a specific list
    const res = await fetch('https://rest.smoove.io/v1/AsyncContacts?listId=' + SMOOVE_LIST_ID + '&updateIfExists=true', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        cellPhone: data.cellPhone,
      }),
    });

    const text = await res.text();
    console.log('AsyncContacts response:', res.status, text);

    return {
      statusCode: res.ok ? 200 : res.status,
      body: text,
    };
  } catch (err) {
    console.error('Smoove error:', err);
    return { statusCode: 500, body: err.message };
  }
};
