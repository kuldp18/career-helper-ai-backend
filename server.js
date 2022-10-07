require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 6000;

// starting a server
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});

app.get('/', (req, res) => {
  res.send('hello world');
});
