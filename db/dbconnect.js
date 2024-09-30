const mongoose = require('mongoose');
require('dotenv').config({ path: './db/.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
}

module.exports = connectDB;