exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const SMOOVE_API_KEY = '2b930959-167d-45ec-989d-29b63173fc50';
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + SMOOVE_API_KEY,
    };

    // Try to create contact
    const res = await fetch('https://rest.smoove.io/v1/Contacts', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        cellPhone: data.cellPhone,
        externalId: 'website-purchase',
        campaignSource: 'website-purchase',
      }),
    });

    const text = await res.text();
    console.log('Smoove:', res.status, text.substring(0, 200));

    // If contact exists (409), try to find and update via GET then PUT
    if (res.status === 409) {
      const searchRes = await fetch('https://rest.smoove.io/v1/Contacts?email=' + encodeURIComponent(data.email), {
        headers,
      });
      const searchData = JSON.parse(await searchRes.text());
      const contacts = Array.isArray(searchData) ? searchData : [searchData];
      const match = contacts.find(c => c.email?.toLowerCase() === data.email.toLowerCase());

      if (match?.id) {
        const putRes = await fetch('https://rest.smoove.io/v1/Contacts/' + match.id, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            id: match.id,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            cellPhone: data.cellPhone,
            externalId: 'website-purchase',
            campaignSource: 'website-purchase',
          }),
        });
        const putText = await putRes.text();
        console.log('PUT existing:', putRes.status, putText.substring(0, 200));
      }
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, body: err.message };
  }
};
