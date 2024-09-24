require('dotenv').config(); // This will load the root .env file
const express = require('express');
const app = express();
const path = require('path');
const connectDB = require('./db/connect');

const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectDB();

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

app.get('/', (req, res) => {
  res.send('sgfmlqsdg');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));