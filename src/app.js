const express = require('express');
const { connectDB } = require("./config/database.js");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth.js");
const profileRouter = require("./routes/profile.js")
const requestRouter = require("./routes/request.js")
const userRouter = require("./routes/user.js")


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter)


connectDB().then(() => {
    console.log("Connection established to database");
    app.listen(7777, () => {
        console.log("Server can listen on port 7777 and get the requests here")
    })
}).catch((error) => {
    console.error("Connection failed: ", error)
})

