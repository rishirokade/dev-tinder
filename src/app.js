const express = require("express");
const authMiddleware = require("./middleware/authMiddleware");
const mongoDbConnection = require("./config/database");
const app = express();

mongoDbConnection().then(() => {
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
    });
});
