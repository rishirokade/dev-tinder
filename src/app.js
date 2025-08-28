const express = require("express");
const mongoDbConnection = require("./config/database");
const UserModel = require("./models/User");

const app = express();

app.post("/user", async (req, res) => {
    UserModel.create({
        userName: "JohnDoe",
        age: 30,
        emailId: "rishi@gmail.com",
        password: "12345",
    }).then((user) => res.status(201).json(user));

    const user = new UserModel({
        userName: "JaneDoe",
        age: 25,
        emailId: "test@gmail.com",
        password: "54321",
    });
    await user.save();
    res.status(201).json(user);
});

mongoDbConnection()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((error) => {
        console.log("Error connecting to database", error);
    });
