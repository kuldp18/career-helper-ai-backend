require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();
const PORT = process.env.PORT || 6000;

// my routes
const authRoutes = require('./routes/auth');

// connect to db

mongoose
  .connect(process.env.DB_URL)
  .then(console.log('DB Connected!'))
  .catch((err) => console.log(err));

// global middlewares

app.use(bodyParser.json());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// My routes
app.use('/api', authRoutes);

// starting a server
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to career helper backend!',
  });
});
