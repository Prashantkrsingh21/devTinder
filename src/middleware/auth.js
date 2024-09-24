const jwt = require("jsonwebtoken");
const User = require("../models/user")

const Auth = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        if (!token) throw new Error("Token is undefined")
        const decodedJwt = jwt.verify(token, "devTinder@123");
        const { _id } = decodedJwt
        const user = await User.findById({ _id });
        if (!user) {
            throw new Error("User not found")
        }
        else {
            req.user = user
            next()
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports = Auth