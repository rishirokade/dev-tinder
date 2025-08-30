const express = require("express");
const mongoDbConnection = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./router/authRouter");
const profileRouter = require("./router/profileRouter");
const connectionRouter = require("./router/connectionRouter");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/connection", authMiddleware, connectionRouter);

mongoDbConnection()
    .then(() => {
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch((error) => {
        console.log("Error connecting to database", error);
    });
