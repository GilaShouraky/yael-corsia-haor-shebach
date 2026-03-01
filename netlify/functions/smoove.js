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

    // Try to create first
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
    console.log('Create:', createRes.status, createText.substring(0, 150));

    if (createRes.status === 409) {
      // Search by email using search endpoint
      const searchRes = await fetch('https://rest.smoove.io/v1/Contacts/search', {
        method: 'POST',
        headers,
        body: JSON.stringify({ email: data.email }),
      });
      const searchText = await searchRes.text();
      console.log('Search:', searchRes.status, searchText.substring(0, 200));

      let contactId = null;
      try {
        const searchData = JSON.parse(searchText);
        const contacts = Array.isArray(searchData) ? searchData : [searchData];
        const match = contacts.find(c => c.email?.toLowerCase() === data.email.toLowerCase());
        contactId = match?.id;
      } catch(e) {}

      if (contactId) {
        const putRes = await fetch('https://rest.smoove.io/v1/Contacts/' + contactId, {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            id: contactId,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            cellPhone: data.cellPhone,
            externalId: 'website-purchase',
            campaignSource: 'website-purchase',
          }),
        });
        const putData = JSON.parse(await putRes.text());
        console.log('PUT:', putRes.status, 'externalId:', putData.externalId);
      } else {
        console.log('Contact not found by search, skipping PUT');
      }
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, body: err.message };
  }
};
