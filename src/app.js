const express = require("express");

const app = express();

app.use(
    "/user",
    (req, resp, next) => {
        console.log("Middleware 1 for /user");
        next();
    },
    (req, resp, next) => {
        console.log("Middleware 2 for /user");
        next();
    },
    (req, resp, next) => {
        console.log("Middleware 3 for /user");
        next();
    },
    (req, resp, next) => {
        console.log("Middleware 4 for /user");
        next();
    },
    (req, resp, next) => {
        resp.send("Hello from middleware 5 /user");
    }
);

app.listen(3000, () => {
    console.log("✅ Server is running on port 3000");
});
