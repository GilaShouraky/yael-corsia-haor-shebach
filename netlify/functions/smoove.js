exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);

    const response = await fetch('https://rest.smoove.io/v1/Contacts?updateIfExists=true&listId=' + 1117962, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 50f2b9e9-534f-49d5-8dc4-2b05ec90039c',
      },
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        cellPhone: data.cellPhone,
        lists_Linked: [1117962],
      }),
    });

    const text = await response.text();
    console.log('Smoove response:', response.status, text);

    return {
      statusCode: response.ok ? 200 : response.status,
      body: text,
    };
  } catch (err) {
    console.error('Smoove error:', err);
    return { statusCode: 500, body: err.message };
  }
};
