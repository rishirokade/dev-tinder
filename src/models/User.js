const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    age: { type: Number, required: true },
    emailId: { type: String },
    password: { type: String },
});

module.exports = mongoose.model("User", userSchema);
