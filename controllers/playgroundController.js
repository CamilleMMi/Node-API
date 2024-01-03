const asyncHandler = require('express-async-handler');

// Throw a fake error
const errorPlayground = (req, res) => {
    throw new Error('fake error');
}

module.exports = {
    errorPlayground,
}