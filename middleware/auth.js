const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;

const adminAuth = (req, res, next) => {
    const token = req.cookie.jwt;

    if(token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if(err){
                return res.status(401).json({ message: 'not authorized' })
            }
            if(decodedToken.role !== 'admin'){
                return res.status(401).json({ message: "not authorized" })
            }
            else{
                next();
            }
        })
    }
    else{
        return res
            .status(401)
            .json({ message: "Not authorized, token not available" })
    }
}

const userAuth = (req, res, next) => {
    const token = req.cookie.jwt;

    if(token) {
        jwt.verify(token, jwtSecret, (err, decodedToken) => {
            if(err){
                return res.status(401).json({ message: 'not authorized' })
            }
            if(decodedToken.role !== 'basic'){
                return res.status(401).json({ message: "not authorized" })
            }
            else{
                next();
            }
        })
    }
    else{
        return res
            .status(401)
            .json({ message: "Not authorized, token not available" })
    }
}

module.exports = { adminAuth, userAuth }