const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const UserModel = require("../models/user");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/", authMiddleware, async (req, res) => {
    try {
        res.status(200).json({ message: "User profile", data: req.user });
    } catch (error) {
        res.status(400).send("something went wrong");
    }
});

// Update user by emailId
profileRouter.patch("/", authMiddleware, async (req, res) => {
    const { emailId } = req.query;
    const updateData = req.body;

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

    try {
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

profileRouter.delete("/", authMiddleware, async (req, res) => {
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

profileRouter.patch("/update-password", authMiddleware, async (req, res) => {
    const emailId = req.query.emailId;
    const { password } = req.body;

    try {
        if (!emailId) throw Error("emailId is required");
        if (!password) throw Error("password is required");

        const user = await UserModel.findOne({
            emailId,
        });

        if (!user) throw Error("User not found");

        const newCryptPassword = await bcrypt.hash(password, 10);
        user.password = newCryptPassword;
        await user.save();

        res.status(200).json({
            data: user,
            message: "Password updated successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: "Error fetching users",
            error: error.message,
        });
    }
});

module.exports = profileRouter;
