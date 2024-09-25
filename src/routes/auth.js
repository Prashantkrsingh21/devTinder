const express = require("express");
const bcrypt = require('bcrypt');
const { validateSignUpData, validateEmail } = require("../utils/validation.js");
const User = require("../models/user.js")

const router = express.Router();

router.post("/signup", async (req, res) => {
    try {
        // Validate the user information 
        validateSignUpData(req);
        const { firstName, lastName, email, password } = req.body;
        // Encrypt the password using bcrypt package
        const passwordHash = await bcrypt.hash(password, 10);
        // Created an instance of the User model
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        });
        await user.save();
        res.status(200).send("User added successfully")
    } catch (error) {
        res.status(400).send("Something went wrong " + error);
    }
})

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        validateEmail(email);
        const user = await User.findOne({ email: email })
        if (!user) {
            throw new Error("Invalid credentials");
        }
        else {
            const isPasswordValid = user.validatePassword(password);
            if (isPasswordValid) {
                const token = user.createJwt();
                res.cookie("token", token)
                res.send("Login successful")
            }
            else {
                throw new Error("Invalid credentials");
            }
        }
    } catch (error) {
        res.status(400).send(error.message);
    }
});

router.post("/logout", async (req, res) => {
    res.cookie("token", null, { expires: new Date() });
    res.send("Logged out successfully");
})


module.exports = router;

