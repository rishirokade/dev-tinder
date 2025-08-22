const express = require("express");
const authMiddleware = require("./middleware/authMiddleware");
const app = express();

// Required to parse JSON request body
app.use(express.json());

// Apply middleware only to /user routes
app.use("/user", authMiddleware);

app.post("/user", (req, res) => {
    res.send("✅ User is logged in");
});

app.listen(3000, () => {
    console.log("✅ Server is running on port 3000");
});
