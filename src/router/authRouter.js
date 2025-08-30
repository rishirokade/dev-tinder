const express = require("express");
const UserModel = require("../models/user");
const validator = require("validator");
const bcrypt = require("bcrypt");
const authRouter = express.Router();

authRouter.post("/signin", async (req, res) => {
    const { emailId, password } = req.body;

    try {
        if (!validator.isEmail(emailId))
            throw Error("Invalid emailID Credentials");

        if (!validator.isStrongPassword(password))
            throw Error("Invalid password Credentials");

        const user = await UserModel.findOne({ emailId });
        if (!user) throw Error("User not found");

        const isValidPassword = user.validPassword(password);
        if (!isValidPassword) throw Error("Invalid Credentials");

        const jwtCookies = await user.getJWTToken();

        res.cookie("token", jwtCookies);
        res.status(200).json({ message: "Login successful" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

authRouter.post("/signup", async (req, res) => {
    const body = req.body;
    try {
        if (!body.emailId) throw Error("emailId is required");
        if (!body.password) throw Error("password is required");

        const bcryptPassword = await bcrypt.hash(body.password, 10);

        const user = new UserModel({ ...body, password: bcryptPassword });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).send(error.message);
    }
});

authRouter.post("/signout", async (req, res) => {
    res.cookie("token", null, {
        expire: new Date(),
    }).send({
        message: "Signout successful",
    });
});

module.exports = authRouter;
