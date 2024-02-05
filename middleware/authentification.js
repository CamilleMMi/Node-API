const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const configuration = require('../configuration/configuration');

const { jwt_key } = configuration;

const authentification = async (req, res, next) => {
    try {
        const authToken = req.header('Authorization').replace('Bearer ', '');
        const decodedToken = jwt.verify(authToken, jwt_key);

        const user = await User.findOne({ _id: decodedToken._id, 'authTokens.authToken': authToken });

        if (!user) {
            throw new Error('Invalid JWT Token');
        }

        req.authToken = authToken;
        req.user = user;

        next();
    } catch(error) {
        res.status(401).send('Please log yourself in');
    }
}

module.exports = authentification;