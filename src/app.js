const express = require("express");
const mongoDbConnection = require("./config/database");
const UserModel = require("./models/User");

const app = express();

app.use(express.json());
app.post("/user", async (req, res) => {
    const body = req.body;
    try {
        const user = new UserModel(body);
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
