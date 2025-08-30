const mongoose = require("mongoose");
const { Schema } = mongoose;

const connectionSchema = new Schema(
    {
        requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
        targeted: { type: Schema.Types.ObjectId, ref: "User", required: true },
        status: {
            type: String,
            enum: ["interested", "accepted", "rejected", "ignored"],
        },
    },
    {
        timestamps: true,
    }
);

// compound index to ensure fast retrieve connection between requester and targeted
connectionSchema.index({ requester: 1, targeted: 1 });

module.exports = mongoose.model("Connection", connectionSchema);
