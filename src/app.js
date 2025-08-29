const express = require("express");
const mongoDbConnection = require("./config/database");
const authMiddleware = require("./middleware/authMiddleware");
const UserModel = require("./models/User");
const validator = require("validator");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signin", async (req, res) => {
    const { userName, password } = req.body;
    try {
        if (
            !validator.isEmail(userName) ||
            !validator.isStrongPassword(password)
        )
            throw Error("Invalid Credentials");

        const user = await UserModel.findOne({ emailId: userName });
        if (!user) throw Error("User not found");

        const isValidPassword = user.validPassword(password);
        if (!isValidPassword) throw Error("Invalid Credentials");

        const jwtCookies = user.getJWTToken();
        res.cookie("token", jwtCookies);
        res.status(200).json({ message: "Login successful", data: user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get("/profile", authMiddleware, async (req, res) => {
    try {
        res.status(200).json({ message: "User profile", data: req.user });
    } catch (error) {
        res.status(400).send("something went wrong");
    }
});

app.post("/signup", async (req, res) => {
    const body = req.body;
    try {
        if (!body.emailId) throw Error("emailId is required");
        if (!body.password) throw Error("password is required");

        const bcryptPassword = await bcrypt.hash(body.password, 10);

        const user = new UserModel({ ...body, password: bcryptPassword });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).send("something went wrong");
    }
});

// Update user by emailId
app.patch("/user", async (req, res) => {
    const { emailId } = req.query;
    const updateData = req.body;

    try {
        const ALLOW_UPDATES_FIELDS = [
            "fullName",
            "emailId",
            "password",
            "age",
            "gender",
            "phoneNumber",
            "address",
            "role",
            "isActive",
            "lastLogin",
            "profilePicture",
        ];
        const requestedUpdateFields = Object.keys(updateData).every((field) =>
            ALLOW_UPDATES_FIELDS.includes(field)
        );

        if (requestedUpdateFields) {
            throw Error("Not allowed to update these fields");
        }

        if (!emailId) {
            return res.status(400).json({ message: "emailId is required" });
        }

        const user = await UserModel.findOneAndUpdate(
            { emailId }, // filter
            { $set: updateData }, // update data update only new data
            { new: true, runValidators: true, context: "query" } // return updated doc + apply validations
        ).select("-password"); // exclude password in response

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            message: "User updated successfully",
            data: user,
        });
    } catch (error) {
        console.error("Error updating user:", error.message);
        res.status(500).json({
            message: "Error updating user",
            error: error.message,
        });
    }
});

app.delete("/user", async (req, res) => {
    const emailId = req.query.emailId;

    try {
        if (!emailId) {
            return resp.json({
                massage: "emailId is required",
            });
        }
        const users = await UserModel.deleteOne({
            emailId: emailId,
        });
        res.status(200).json({
            data: users,
            message: "User deleted successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message,
        });
    }
});
app.get("/user", async (req, res) => {
    const emailId = req.query.emailId;
    try {
        const users = await UserModel.find({
            emailId: emailId,
        });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message,
        });
    }
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
