const express = require("express");
const Auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const { validateEditPayload } = require("../utils/validation");
const validator = require("validator");
const router = express.Router();

router.get('/profile/view', Auth, async (req, res) => {
    const user = req.user
    try {
        res.send(user)
    } catch (error) {
        res.status(400).send(error.message)
    }
});

router.post("/profile/edit", Auth, async (req, res) => {
    try {
        if (!validateEditPayload(req)) {
            throw new Error("Edit is not allowed beacuse of unnwanted fields");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key]
        });
        await loggedInUser.save();
        res.send(`${loggedInUser.firstName} ${loggedInUser.lastName}, your profile is updated`)

    } catch (error) {
        res.status(400).send(error.message)
    }
});

router.post("/profile/forgot/password", Auth, async (req, res) => {
    try {
        const changePassword = req.body.password;
        if (!validator.isStrongPassword(changePassword)) {
            throw new Error("Please enter a strong password");
        }
        const loggedInUser = req.user;
        const isValidPassword = await loggedInUser.validatePassword(changePassword);
        if (isValidPassword) {
            throw new Error("Password is the same as the previous password, Please enter a new one");
        }
        const passwordHash = await bcrypt.hash(changePassword, 10);
        loggedInUser.password = passwordHash;
        await loggedInUser.save();

        res.send("Password updated successfully")

    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router