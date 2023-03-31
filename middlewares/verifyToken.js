const jwt = require("jsonwebtoken");


const verifyToken= (req, res, next) => {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' })
    }
    const token = authHeader.split(' ')[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            return res.status(403).send({ message: 'forbidden access' })
        }
        req.decoded = decoded //je data ta token er moddhe ase sheta amra  decoded er moddhe pabo
        next()
    });
}

module.exports = {verifyToken};