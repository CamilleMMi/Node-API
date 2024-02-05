const dotenv = require('dotenv');

dotenv.config();

const { NODE_ENV, MONGODB_URL, PORT, FRONT_END, SECRET_KEY, ENCRYPTION_METHOD, IV_LENGTH, JWT_KEY }  = process.env;

module.exports = {
    env: NODE_ENV,
    mongodb_url: MONGODB_URL,
    port: PORT,
    front_end: FRONT_END,
    secret_key: SECRET_KEY,
    encryption_method: ENCRYPTION_METHOD,
    iv_length: IV_LENGTH,
    jwt_key: JWT_KEY
}