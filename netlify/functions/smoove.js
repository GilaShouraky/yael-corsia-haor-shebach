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

    // Search for contact by email first
    const searchRes = await fetch('https://rest.smoove.io/v1/Contacts?email=' + encodeURIComponent(data.email), {
      headers,
    });
    const searchData = JSON.parse(await searchRes.text());
    const contacts = Array.isArray(searchData) ? searchData : [searchData];
    const match = contacts.find(c => c.email?.toLowerCase() === data.email.toLowerCase());

    if (match?.id) {
      // Contact exists - PUT with externalId
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
      const putData = JSON.parse(await putRes.text());
      console.log('PUT existing:', putRes.status, 'externalId:', putData.externalId);
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
          externalId: 'website-purchase',
          campaignSource: 'website-purchase',
        }),
      });
      const createText = await createRes.text();
      console.log('Create:', createRes.status, createText.substring(0, 100));
      if (createRes.status !== 409) {
        const createData = JSON.parse(createText);
        console.log('Created externalId:', createData.externalId);
      }
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, body: err.message };
  }
};
