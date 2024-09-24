const express = require('express');
const { connectDB } = require("./config/database.js");
const { validateSignUpData, validateEmail } = require("./utils/validation.js");
const cookieParser = require("cookie-parser");
const bcrypt = require('bcrypt');
const User = require("./models/user.js");
const Auth = require('./middleware/auth.js');


const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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
})

app.get('/profile', Auth, async (req, res) => {
    const user = req.user
    try {
        res.send(user)
    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.get("/users", async (req, res) => {
    // const email  = req.body.email;
    try {
        const users = await User.find({})
        if (users.length === 0) {
            res.status(404).send("No users are there currently in the system");
        }
        res.send(users)
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
})

app.get("/userbyemail", async (req, res) => {
    const email = req.body.email;
    try {
        const users = await User.findOne({ email })
        if (!users) {
            res.status(404).send("No users are there currently in the system");
        }
        else {
            res.send(users)
        }
    } catch (error) {
        res.status(500).send("Something went wrong");
    }
})

app.delete("/user", async (req, res) => {
    const userId = req.body.userId;
    try {
        const deletedUser = await User.findByIdAndDelete(userId)
        if (!deletedUser) {
            res.send("User is not there in the database")
        }
        else {
            res.send("User deleted successfully")
        }
    } catch (error) {

    }
})


app.patch("/user/:userId", async (req, res) => {
    const userId = req.query?.params;
    const data = req.body;




    try {
        const allowedKey = ["age", "firstName", "lastName", 'password', "gender", "photoUrl", "about", "skills"];
        const updateAllowed = Object.keys(req.body).every((key) => allowedKey.includes(key));

        if (!updateAllowed) {
            throw new Error("Update is not allowed")
        }
        const updatedUser = await User.findByIdAndUpdate(userId, data, { runValidators: true });
        if (!updatedUser) {
            res.send("User is not there in the database")
        }
        else {
            res.send("User updated successfully")
        }

    } catch (error) {
        res.status(500).send("Something went wrong" + error);
    }
},)

connectDB().then(() => {
    console.log("Connection established to database");
    app.listen(7777, () => {
        console.log("Server can listen on port 7777 and get the requests here")
    })
}).catch((error) => {
    console.error("Connection failed: ", error)
})

