const express = require("express");

const app = express();

// order of route matter
// at path string we can write regex that also work

// handle all requests with regex
app.use("/ab(dc)?d+z*bb", (req, resp) => {
    resp.send("Hello from regex route");
});

// 👉 Example: curl http://localhost:3000/abdd
// 👉 Example: curl http://localhost:3000/abcd

// handle all requests
app.use("/test", (req, resp) => {
    resp.send("Hello from test");
});
// 👉 Example: curl http://localhost:3000/test

// handle POST requests
app.post("/user", (req, resp) => {
    resp.send("Hello from user POST");
});
// 👉 Example: curl -X POST http://localhost:3000/user

// handle GET with dynamic param
app.get("/user/:userid", (req, resp) => {
    console.log("Query params:", req.query); // ex: ?age=25
    console.log("Route param:", req.params.userid);
    resp.send(`Hello from user get, userId=${req.params.userid}`);
});
// 👉 Example: curl "http://localhost:3000/user/101?age=25"

// handle GET without param
app.get("/user", (req, resp) => {
    console.log("Query params:", req.query);
    resp.send("Hello from user get (no param)");
});
// 👉 Example: curl "http://localhost:3000/user?name=rishi"

// handle PATCH requests
app.patch("/user", (req, resp) => {
    resp.send("Hello from user PATCH");
});
// 👉 Example: curl -X PATCH http://localhost:3000/user

// handle DELETE requests
app.delete("/user", (req, resp) => {
    resp.send("Hello from user DELETE");
});
// 👉 Example: curl -X DELETE http://localhost:3000/user

app.listen(3000, () => {
    console.log("✅ Server is running on port 3000");
});
