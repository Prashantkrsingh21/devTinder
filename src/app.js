const express = require('express');
const { connectDB } = require("./config/database.js")
const User = require("./models/user.js")

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    // Created an instance of the User model
    const user = new User(req.body);

    try {
        await user.save();
        res.status(200).send("User added successfully")
    } catch (error) {
        res.status(400).send("Something went wrong", error);
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


app.patch("/user", async (req, res) => {
    const userId = req.body.userId;
    const email = req.body.email;
    const data = req.body;

    try {
        // const updatedUser = await User.findByIdAndUpdate(userId, data);
        const updatedUser = await User.findOneAndUpdate({ email }, data);
        if (!updatedUser) {
            res.send("User is not there in the database")
        }
        else {
            res.send("User updated successfully")
        }

    } catch (error) {
        res.status(500).send("Something went wrong");
    }
})

connectDB().then(() => {
    console.log("Connection established to database");
    app.listen(7777, () => {
        console.log("Server can listen on port 7777 and get the requests here")
    })
}).catch((error) => {
    console.error("Connection failed: ", error)
})

