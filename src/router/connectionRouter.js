const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/user");
const connection = require("../models/connection");
const connectionRouter = express.Router();

connectionRouter.post("/send/:status/:targetedUserId", async (req, res) => {
    const user = req.user;
    const targetedUserId = req.params.targetedUserId;
    const status = req.params.status;

    try {
        if (!["interested", "ignored"].includes(status))
            throw Error("Invalid status");

        if (!targetedUserId)
            throw Error("User is required to create connection");

        const targetedUser = await User.findById(targetedUserId);
        if (!targetedUser) throw Error("Targeted user not found");

        if (targetedUserId === user._id)
            throw Error("You cannot connect with yourself");

        const existingConnection = await connection.findOne({
            $or: [
                { requester: user._id, targeted: targetedUserId },
                { requester: targetedUserId, targeted: user._id },
            ],
        });

        if (existingConnection)
            throw Error(
                `Connection between ${targetedUser.fullName} and ${user.fullName} already exist and status is ${status}`
            );

        await connection.create({
            requester: user._id,
            targeted: targetedUserId,
            status,
        });
        res.status(200).send({
            message: `Connection ${status} successfully`,
            data: { requester: user._id, targeted: targetedUserId, status },
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

connectionRouter.post("/review/:status/:targetedUserId", async (req, res) => {
    const loggedInUser = req.user;
    const { targetedUserId, status } = req.params;
    console.log(status);

    try {
        if (!["rejected", "accepted"].includes(status))
            throw Error("Invalid status");

        if (!targetedUserId)
            throw Error("User is required to create connection");

        const targetedUser = await User.findById(targetedUserId);
        if (!targetedUser) throw Error("Targeted user not found");

        if (targetedUserId === loggedInUser._id)
            throw Error("You cannot connect with yourself");

        const existingConnection = await connection.findOne({
            requester: targetedUserId,
            targeted: loggedInUser._id,
            status: "interested",
        });

        if (!existingConnection)
            throw Error(
                `No pending connection request from ${targetedUser.fullName}`
            );

        existingConnection["status"] = status;
        await existingConnection.save();

        res.status(200).send({
            message: `Connection ${status} successfully`,
            data: existingConnection,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = connectionRouter;
