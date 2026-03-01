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
      // Contact exists - update using updateIfExists
      const updateRes = await fetch('https://rest.smoove.io/v1/Contacts?updateIfExists=true', {
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
      const updateText = await updateRes.text();
      console.log('Update:', updateRes.status, updateText.substring(0, 200));

      let contactId = null;
      try {
        const updateData = JSON.parse(updateText);
        contactId = updateData.id;
        console.log('Updated contact:', contactId, 'externalId:', updateData.externalId);
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
      }
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('Error:', err);
    return { statusCode: 500, body: err.message };
  }
};
