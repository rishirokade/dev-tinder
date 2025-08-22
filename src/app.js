const express = require("express");

const app = express();

// order of route matter

// handle all requests
app.use("/test", (req, resp) => {
    resp.send("Hello from test");
});

// handle post and  requests
app.post("/user", (req, resp) => {
    resp.send("Hello from user POST");
});

// handle only GET requests
app.get("/user", (req, resp) => {
    resp.send("Hello from user get");
});

app.listen(3000, () => {
    console.log(3000, "Server is running on port 3000");
});
