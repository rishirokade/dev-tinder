const express = require("express");

const app = express();

// order of route matter
app.use("/test", (req, resp) => {
    resp.send("Hello from test");
});

app.use("/hello/2", (req, resp) => {
    resp.send("Hello hello/2");
});

app.use("/hello", (req, resp) => {
    resp.send("Hello hello");
});

app.use("/", (req, resp) => {
    resp.send("Hello from /");
});

app.listen(3000, () => {
    console.log(3000, "Server is running on port 3000");
});
