const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const errorMiddleware = require('./middleware/errorMiddleware');
const cors = require('cors');

// Global variables

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT;
const FRONT_END = process.env.FRONT_END;

// Routes

const userRoute = require('./routes/userRoute');
const collectionRoute = require('./routes/collectionRoute');
const playgroundRoute = require('./routes/playgroundRoute');

// App config

const corsOptions = {
    origin: [FRONT_END, 'http://quelquechose.com'],
    optionsSuccessStatus: 200
}

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use('/user', userRoute);
app.use('/collection', collectionRoute);
app.use('/playground', playgroundRoute);

app.use(errorMiddleware);

// Mongoose connection and launching app

mongoose.connect(MONGODB_URL).then(() => {
    console.log('\nConnected to MongoDB')
    app.listen(PORT, () => {
        console.log(`Node API app is running on port ${PORT}\n`)
    })
}).catch((error) => {
    console.log(error)
})