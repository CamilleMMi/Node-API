const dotenv = require('dotenv');

dotenv.config();

const { NODE_ENV, MONGODB_URL, PORT, FRONT_END, SECRET_KEY, ENCRYPTION_METHOD, IV_LENGTH, JWT_KEY, PLAN_ID, TOKEN_SINCH, REGION, TEST_NUMBER }  = process.env;

module.exports = {
    env: NODE_ENV,
    mongodb_url: MONGODB_URL,
    port: PORT,
    front_end: FRONT_END,
    secret_key: SECRET_KEY,
    encryption_method: ENCRYPTION_METHOD,
    iv_length: IV_LENGTH,
    jwt_key: JWT_KEY,
    plan_id: PLAN_ID,
    token_sinch: TOKEN_SINCH,
    region: REGION,
    test_number: TEST_NUMBER
}