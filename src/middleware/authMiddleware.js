const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");

const authMiddleware = async (req, res, next) => {
    const cookies = req.cookies;
    try {
        if (!cookies || !cookies.token) throw Error("Unauthorized");
        const { _id } = jwt.verify(cookies.token, "jwtSecretKey");

        if (!_id) throw Error("Token not valid");
        const user = await UserModel.findById(_id).select("-password");

        if (!user) throw Error("User not found");
        req.user = user;

        next();
    } catch (error) {
        res.status(404).send(error.message);
    }
};

module.exports = authMiddleware;
