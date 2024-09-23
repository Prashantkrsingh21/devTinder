const mongoose = require('mongoose');
const validator = require("validator");

const { Schema, model } = mongoose

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
        minLength: 4
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        minLength: 4
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is not valid: " + value)
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Enter a strong password" + value)
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "others"].includes(value)) {
                throw new Error("Gender is not valid")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.istockphoto.com%2Fphotos%2Fprofile-image&psig=AOvVaw1sIzWyyxUzYIYz95u2Vxkv&ust=1727184824079000&source=images&cd=vfe&opi=89978449&ved=0CBEQjRxqFwoTCOCZ8YKX2YgDFQAAAAAdAAAAABAE",
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error("Photo url is not valid one " + value)
            }
        }
    },
    about: {
        type: String,
        default: "This is the default about section of the user "
    },
    skills: {
        type: [String]
    }
}, {
    timestamps: true
});

const User = model("User", userSchema);

module.exports = User