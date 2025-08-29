const mongoose = require("mongoose");
const validator = require("validator");
//  validator run on save or create time mongo does not validate
//  for other update need to explicitly mention during action to validate action
// or we can call On validate() or validateSync() manually on model

// Always runs: save(), create(), validate()
// Optional (need runValidators: true): updateOne(), findOneAndUpdate(), etc.
// Does NOT run: deleteOne(), remove(), find() (no data changes, so no validation needed)

const userSchema = new mongoose.Schema(
    {
        userName: {
            type: String,
            required: [true, "Username is required"],
            trim: true,
            minlength: [3, "Username must be at least 3 characters"],
            maxlength: [30, "Username cannot exceed 30 characters"],
            validate: {
                validator: (v) =>
                    validator.isAlphanumeric(v, "en-US", { ignore: "_" }),
                message:
                    "Username can only contain letters, numbers, and underscores",
            },
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
            validate: {
                validator: (v) => validator.isEmail(v),
                message: "Please use a valid email address",
            },
            index: true,
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters"],
            maxlength: [128, "Password cannot exceed 128 characters"],
            validate: {
                validator: (v) =>
                    validator.isStrongPassword(v, {
                        minLength: 8,
                        minLowercase: 1,
                        minUppercase: 1,
                        minNumbers: 1,
                        minSymbols: 1,
                    }),
                message:
                    "Password must contain uppercase, lowercase, number and special character",
            },
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
            unique: true,
            sparse: true, // Allows null + unique
            validate: {
                validator: (v) =>
                    !v ||
                    validator.isMobilePhone(v, "any", { strictMode: false }),
                message: "Invalid phone number format",
            },
        },
        address: {
            street: { type: String, trim: true },
            city: { type: String, trim: true },
            state: { type: String, trim: true },
            country: { type: String, trim: true },
            postalCode: {
                type: String,
                validate: {
                    validator: (v) => !v || validator.isPostalCode(v, "any"),
                    message: "Postal code is invalid",
                },
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
            type: String,
            validate: {
                validator: (v) =>
                    !v || validator.isURL(v, { protocols: ["http", "https"] }),
                message: "Must be a valid image URL",
            },
        },
        bio: {
            type: String,
            maxlength: [200, "Bio cannot exceed 200 characters"],
            trim: true,
        },
        socialLinks: {
            github: {
                type: String,
                validate: {
                    validator: (v) =>
                        !v ||
                        validator.isURL(v, {
                            require_protocol: true,
                            host_whitelist: ["github.com", "www.github.com"],
                        }),
                    message: "Invalid GitHub URL",
                },
            },
            linkedin: {
                type: String,
                validate: {
                    validator: (v) =>
                        !v ||
                        validator.isURL(v, {
                            require_protocol: true,
                            host_whitelist: [
                                "linkedin.com",
                                "www.linkedin.com",
                            ],
                        }),
                    message: "Invalid LinkedIn URL",
                },
            },
            twitter: {
                type: String,
                validate: {
                    validator: (v) =>
                        !v ||
                        validator.isURL(v, {
                            require_protocol: true,
                            host_whitelist: ["twitter.com", "www.twitter.com"],
                        }),
                    message: "Invalid Twitter URL",
                },
            },
        },
        createdAt: {
            type: Date,
            default: Date.now,
            immutable: true,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Auto-update `updatedAt` before save
userSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model("User", userSchema);
