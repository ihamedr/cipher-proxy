const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// فعال‌سازی CORS برای همه درخواست‌ها
app.use(cors());

app.get('/proxy', async (req, res) => {
  const { action, userId, word } = req.query;

  if (!action || !userId) {
    return res.status(400).json({ error: 'Missing required query parameters: action and userId' });
  }

  const scriptUrl = `https://script.google.com/macros/s/AKfycbyzV4s99akLYxGNjVKhzUwghzsquvbgh5eoewXltve4f22mxCueuP7Y1M-79FV_ACkMDg/exec?action=${encodeURIComponent(action)}&userId=${encodeURIComponent(userId)}${word ? `&word=${encodeURIComponent(word)}` : ''}`;

  try {
    const response = await fetch(scriptUrl);

    if (!response.ok) {
      console.error('Error response from script:', response.status, response.statusText);
      return res.status(response.status).json({ error: `Upstream error: ${response.statusText}` });
    }

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