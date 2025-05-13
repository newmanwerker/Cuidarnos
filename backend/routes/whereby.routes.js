// routes/whereby.routes.js
console.log('Rutas de Whereby cargadas');
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();
const endDate = new Date(Date.now() + 30 * 60 * 1000).toISOString(); // +30 minutos

router.post('/create-whereby-room', async (req, res) => {
  try {
    const response = await fetch('https://api.whereby.dev/v1/meetings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmFwcGVhci5pbiIsImF1ZCI6Imh0dHBzOi8vYXBpLmFwcGVhci5pbi92MSIsImV4cCI6OTAwNzE5OTI1NDc0MDk5MSwiaWF0IjoxNzQ3MTE0NjcwLCJvcmdhbml6YXRpb25JZCI6MzE1ODE2LCJqdGkiOiI5YzJiNGQzYS00NDA2LTRiZTUtYmVkMC0xYjFhNmQ3MDQyMzMifQ.3CFzuvA7-ms_acd9exuzW-DIjvqN0ZquzGkE8VhnJvk'
      },
      body: JSON.stringify({
        isLocked: false,
        roomMode: 'normal',
        endDate,
        fields: ['roomUrl']
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    res.json({ roomUrl: data.roomUrl });
  } catch (error) {
    console.error('Error creando sala Whereby:', error);
    res.status(500).json({ error: 'Error creando sala Whereby' });
  }
});

module.exports = router;
