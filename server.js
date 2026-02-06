const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Validate env
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
   🔥 MANUAL CORS (RAILWAY SAFE)
   =============================== */
app.use((req, res, next) => {
    res.header(
        "Access-Control-Allow-Origin",
        "https://dodeck-ivory.vercel.app"
    );
    res.header(
        "Access-Control-Allow-Methods",
        "GET,POST,PUT,DELETE,OPTIONS"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization"
    );

    if (req.method === "OPTIONS") {
        return res.sendStatus(204);
    }

    next();
});

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
   DB + SERVER
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
