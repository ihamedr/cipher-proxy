const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = 3000;

// فعال‌سازی CORS برای همه درخواست‌ها
app.use(cors());

app.get('/proxy', async (req, res) => {
  const { action, userId, word } = req.query;

  const scriptUrl = `https://script.google.com/macros/s/AKfycbyRG94adV_4DXmb9YKUqHw81fI1HpptRvPfIiwn5FoNu5iBQe_scQKxzd5zTL7mZVXH5A/exec?action=${action}&userId=${userId}${word ? &word=${encodeURIComponent(word)} : ''}`;

  try {
    const response = await fetch(scriptUrl);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error forwarding request:', error);
    res.status(500).json({ error: 'Proxy error' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server is running at http://localhost:${PORT}`);
});