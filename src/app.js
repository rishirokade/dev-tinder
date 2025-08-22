const express = require("express");

const app = express();

app.use("/test", (req, resp) => {
    resp.send("Hello World");
});

app.listen(3000, () => {
    console.log(3000, "Server is running on port 3000");
});
