const validator = require("validator")

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body

    if (!firstName || !lastName) {
        throw new Error("Name is not valid");
    }
    else if (firstName.length < 4 || firstName.length > 50) {
        throw new Error("First name should be between 4 and 50 in length");
    }
    else if (!validator.isEmail(email)) {
        throw new Error("Email is not valid");
    }
    else if (!validator.isStrongPassword(password)) {
        throw new Error("Enter a strong password");
    }
}

const validateEditPayload = (req) => {
    const allowedEditableFields = ["firstName", "lastName", "age", "gender", "skills", "about", "photoUrl"];
    const isEditAllowed = Object.keys(req.body).every((key) => allowedEditableFields.includes(key));

    return isEditAllowed;
}

const validateEmail = (email) => {
    if (!validator.isEmail(email)) {
        throw new Error("Email is invalid")
    }
}

module.exports = { validateSignUpData, validateEmail, validateEditPayload }