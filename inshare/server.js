const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');

require('dotenv/config')

const app = express()

// Allow all origins
app.use(cors());

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true, // Enable credentials for cookies
}));
app.use(cookieParser());

// Import your route files
// const authMiddleware = require('./routes/authMiddleware');
const authRoute = require(`./routes/auth`);
const userRoute = require(`./routes/users`);
const postRoute = require(`./routes/posts`);
const commentRoute = require(`./routes/comments`);
const categoryRoute = require(`./routes/categories`);

// Use your route files
// app.use(authMiddleware);
app.use(`/api`, authRoute);
app.use(`/api`, userRoute);
app.use(`/api`, postRoute);
app.use(`/api`, commentRoute);
app.use(`/api`, categoryRoute);

// db connection
mongoose.connect(process.env.MOGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'inShare', //Collection Name
}).then(() => console.log("Connected to inShare DB"))
    .catch((err) => {
        console.log("No Connection. Reason: " + err);
    });

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
}

app.get('*', (request, response) => {
    response.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => { console.log(`Server started at port: ${PORT}`) })
