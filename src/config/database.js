const connectionString = "mongodb+srv://prashantKumar:0SBNSXarT7XXk3IX@namastedev.toqhv.mongodb.net/devTinder"
const mongoose = require("mongoose");

async function connectDB() {
    await mongoose.connect(connectionString)
}

module.exports = { connectDB }