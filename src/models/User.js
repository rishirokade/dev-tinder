const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    age: { type: Number, required: true },
});

module.exports = mongoose.model("User", userSchema);
