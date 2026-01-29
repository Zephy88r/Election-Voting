const express = require('express');
const path = require('path');
const app = express();
const port = 5173;

// Serve static files from public directory
app.use(express.static('public'));
app.use(express.static('src'));

// Serve the main HTML file for all routes (SPA)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});