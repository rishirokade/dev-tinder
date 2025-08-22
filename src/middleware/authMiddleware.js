function authMiddleware(req, res, next) {
    const token = req.body?.token;
    console.log(req.body, "inside authMiddleware");

    if (token === "RRR") {
        return next();
    }

    return res.status(401).send("Unauthorized: Please log in");
}

module.exports = authMiddleware;
