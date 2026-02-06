const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// 🔴 Validate required environment variables (fail fast)
if (!process.env.JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined.');
    process.exit(1);
}

if (!process.env.MONGO_URI) {
    console.error('FATAL ERROR: MONGO_URI is not defined.');
    process.exit(1);
}

const app = express();

/* ===============================
   ✅ CORS CONFIG (PRODUCTION SAFE)
   =============================== */
const corsOptions = {
    origin: [
        'https://dodeck-ivory.vercel.app', // production frontend
        'http://localhost:5173'            // local dev (optional)
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};

// 🔥 MUST be before routes
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

/* ===============================
   ROUTES
   =============================== */
app.get('/', (req, res) => {
    res.send('DoDeck Backend is working!');
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

/* ===============================
   DB + SERVER START
   =============================== */
const PORT = process.env.PORT || 3000;

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected!');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    });
