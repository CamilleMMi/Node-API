const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const errorMiddleware = require('./middleware/errorMiddleware');
const cors = require('cors');

// Routes

const userRoute = require('./routes/userRoute');
const playgroundRoute = require('./routes/playgroundRoute');

// App config

dotenv.config();
const app = express();

app.use(express.json());
app.use('/user', userRoute);
app.use('/playground', playgroundRoute);
app.use(errorMiddleware);

// Global variables

const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT;

// Mongoose connection and launching app

mongoose.connect(MONGODB_URL).then(() => {
    console.log('\nConnected to MongoDB')
    app.listen(PORT, () => {
        console.log(`Node API app is running on port ${PORT}\n`)
    })
}).catch((error) => {
    console.log(error)
})