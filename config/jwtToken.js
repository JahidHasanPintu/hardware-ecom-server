const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    const token = jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '24h' });
    return token;
};

module.exports = {generateToken};