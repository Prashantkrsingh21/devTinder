const express = require('express');
const { connectDB } = require("./config/database.js")
const User = require("./models/user.js")

const app = express();

app.post("/signup", async (req, res) => {
    // Created an instance of the User model
    const user = new User({
        firstName: "Shaktiprada",
        lastName: "Mohapatra",
        email: "mshaktiprada@gmail.com",
        password: "Shakti@123"
    });

    try {
        await user.save();
        res.status(200).send("User added successfully")
    } catch (error) {
        res.status(400).send("Something went wrong", error);
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

