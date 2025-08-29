const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [30, "Username cannot exceed 30 characters"],
            match: [
                /^[a-zA-Z0-9_]+$/,
                "Username can only contain letters, numbers, and underscores",
            ],
            unique: true,
        },
        fullName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 50,
        },
        emailId: {
            type: String,
            required: [true, "Email is required"],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
            index: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            maxlength: [128, "Password cannot exceed 128 characters"],
            match: [
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                "Password must contain uppercase, lowercase, number and special character",
            ],
            select: false, // Don't return password by default
        },
        age: {
            type: Number,
            min: [13, "Minimum age is 13"],
            max: [120, "Maximum age is 120"],
        },
        gender: {
            type: String,
            enum: ["male", "female", "other"],
            default: "other",
        },
        phoneNumber: {
            type: String,
            match: [
                /^\+?[1-9]\d{1,14}$/,
                "Invalid phone number format (E.164 standard)",
            ],
            unique: true,
            sparse: true, // Allows null + unique
        },
        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            country: { type: String, trim: true },
            postalCode: {
                type: String,
                match: [/^\d{4,10}$/, "Postal code must be 4–10 digits"],
            },
        },
        role: {
            type: String,
            enum: ["user", "admin", "moderator"],
            default: "user",
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        lastLogin: {
            type: Date,
        },
        profilePicture: {
            type: String, // store URL or file path
            match: [
                /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/,
                "Must be a valid image URL",
            ],
        },
        bio: {
            type: String,
            maxlength: [200, "Bio cannot exceed 200 characters"],
            trim: true,
        },
        socialLinks: {
            github: {
                type: String,
                match: [
                    /^https?:\/\/(www\.)?github\.com\/.+$/,
                    "Invalid GitHub URL",
                ],
            },
            linkedin: {
                type: String,
                match: [
                    /^https?:\/\/(www\.)?linkedin\.com\/.+$/,
                    "Invalid LinkedIn URL",
                ],
            },
            twitter: {
                type: String,
                match: [
                    /^https?:\/\/(www\.)?twitter\.com\/.+$/,
                    "Invalid Twitter URL",
                ],
            },
        },
        createdAt: {
            type: Date,
            default: Date.now,
            immutable: true, // Can't be changed once created
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

userSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("User", userSchema);
