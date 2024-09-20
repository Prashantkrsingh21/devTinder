const express = require('express');

const app = express();

app.use("/test", (req, res) => {
    res.send("Hello from test page")
})


app.use("/hello", (req, res) => {
    res.send("Hello from hello page")
})

app.use("/", (req, res) => {
    res.send("Hello from server on 7777")
})

app.listen(7777, () => {
    console.log("Server can listen on port 7777 and get the requests here")
})