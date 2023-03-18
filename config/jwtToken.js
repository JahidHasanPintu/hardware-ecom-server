const jwt = require("jsonwebtoken");

const generateToken = (id) => {
    const token = jwt.sign({id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
    return token;
};

module.exports = {generateToken};