const crypto = require('crypto');
const configuration = require('../configuration/configuration');

const { secret_key, encryption_method, iv_length } = configuration;

if (!secret_key || !encryption_method || !iv_length) {
    throw new Error('Secret key, Encryption method and IV length required');
}

function encryptData(data) {

    console.log('Entrée');
    console.log(data);

    const iv = crypto.randomBytes(parseInt(iv_length));
    const cipher = crypto.createCipheriv(encryption_method, Buffer.from(secret_key, 'hex'), iv);

    let encrypted = cipher.update(data);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decryptData(text) {
    const textParts = text.split(":");
    const iv = Buffer.from(textParts.shift(), "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");
    const decipher = crypto.createDecipheriv(encryption_method, Buffer.from(secret_key, 'hex'), iv);

    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}


module.exports = { encryptData, decryptData };