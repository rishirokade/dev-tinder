const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const connection = require("../models/connection");
const User = require("../models/user");
const userRouter = express.Router();
const SELECT_USER_FIELD = "fullName emailId age gender role";

userRouter.get("/feed", async (req, res) => {
    const loggedInUser = req.user;
    const { limit = 10, pageNumber } = req.query;
    const finalLimit = parseInt(limit) > 100 ? 50 : parseInt(limit);
    const skip = pageNumber ? (parseInt(pageNumber) - 1) * finalLimit : 0;
    try {
        const connectionsRequested = await connection.find({
            $or: [
                { targeted: loggedInUser._id },
                { requester: loggedInUser._id },
            ],
        });
        const hideUserFromFeedIds = new Set();
        connectionsRequested.forEach((connection) => {
            hideUserFromFeedIds.add(connection.requester.toString());
            hideUserFromFeedIds.add(connection.targeted.toString());
        });

        const feed = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeedIds) } },
                { _id: { $ne: loggedInUser._id } },
            ],
        })
            .select(SELECT_USER_FIELD)
            .skip(skip)
            .limit(finalLimit);

        res.status(200).json({
            message: `${loggedInUser.fullName} feed`,
            data: feed,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});
userRouter.get("/connections/received", async (req, res) => {
    const loggedInUser = req.user;
    try {
        const connections = await connection
            .find({
                targeted: loggedInUser._id,
                status: "interested",
            })
            .populate("requester", ["fullName", "emailId"]);
        res.status(200).json({
            message: `${loggedInUser.fullName} received request connections`,
            data: connections,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

userRouter.get("/connections/accepted", async (req, res) => {
    const loggedInUser = req.user;
    try {
        const connections = await connection
            .find({
                $or: [
                    { targeted: loggedInUser._id },
                    { requester: loggedInUser._id },
                ],
                status: "accepted",
            })
            .populate("targeted", ["fullName", "emailId"])
            .populate("requester", ["fullName", "emailId"]);

        res.status(200).json({
            message: `${loggedInUser.fullName} friends`,
            data: connections,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

userRouter.get("/connections/sent", async (req, res) => {
    const loggedInUser = req.user;
    try {
        const connections = await connection
            .find({
                requester: loggedInUser._id,
                status: "interested",
            })
            .populate("targeted", ["fullName", "emailId"]);

        res.status(200).json({
            message: `${loggedInUser.fullName} interested connections`,
            data: connections,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

userRouter.get("/connections/rejected", async (req, res) => {
    const loggedInUser = req.user;
    try {
        const connections = await connection
            .find({
                targeted: loggedInUser._id,
                status: "rejected",
            })
            .populate("requester", ["fullName", "emailId"]);

        res.status(200).json({
            message: `${loggedInUser.fullName} rejected connections`,
            data: connections,
        });
    } catch (error) {
        res.status(400).send(error.message);
    }
});
module.exports = userRouter;
