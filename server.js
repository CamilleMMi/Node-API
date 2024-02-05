const express = require('express');
const mongoose = require('mongoose');
const errorMiddleware = require('./middleware/errorMiddleware');
const cors = require('cors');
const configuration = require('./configuration/configuration');

// Global variables

const { mongodb_url, port, front_end } = configuration;

// Routes

const userRoute = require('./routes/userRoute');
const collectionRoute = require('./routes/collectionRoute');
const playgroundRoute = require('./routes/playgroundRoute');

// App config

const corsOptions = {
    origin: [front_end, 'http://quelquechose.com'],
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

mongoose.connect(mongodb_url).then(() => {
    console.log('\nConnected to MongoDB')
    app.listen(port, () => {
        console.log(`Node API app is running on port ${port}\n`)
    })
}).catch((error) => {
    console.log(error)
})