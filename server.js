import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
const app = express();
const PORT = process.env.PORT || 6000;

// connect to db

try {
  await mongoose.connect(process.env.DB_URL);
  console.log('DB Connected!');
} catch (error) {
  console.log(error);
}

// starting a server
app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to career helper backend!',
  });
});
