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