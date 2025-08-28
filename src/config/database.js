const mongoose = require("mongoose");

const connectToDatabase = async () => {
    return await mongoose.connect(
        "mongodb+srv://hrishi:Hrishi.123@namaste-nodejs.njtk9jt.mongodb.net/"
    );
};

module.exports = connectToDatabase;
