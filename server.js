require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const User = require('./models/userModel')

// app config

const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT;

const app = express();
app.use(express.json());

// routes

app.get('/', (req, res) => {
    res.send('Hello Node API');
})

app.get('/users', async(req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.get('/user/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.post('/user', async(req, res) => {
    try {
        const user = await User.create(req.body)
        res.status(200).json(user)
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: error.message });
    }
})

app.put('/user/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body);
        
        if(!user) {
            return res.status(404).json({ message: `Cannot find any user with the id: ${id}` });
        }

        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.delete('/user/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);

        if(!user) {
            return res.status(404).json({ message: `Cannot find any user with the id: ${id}`});
        }

        res.status(200).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// mongoose connection and launching app

mongoose.connect(MONGODB_URL).then(() => {
    console.log('\nConnected to MongoDB')
    app.listen(PORT, () => {
        console.log(`Node API app is running on port ${PORT}\n`)
    })
}).catch((error) => {
    console.log(error)
})