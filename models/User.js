const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const Schema = mongoose.Schema;
const crypto = require('crypto');
const Recipe = require("./Recipe");

const UserSchema = new Schema({

    name: {
        type: String,
        required: [true, "Please provide a name."]
    },
    email: {
        type: String,
        required: [true, "Please provide a email"],
        unique: true,
        match: [
            /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "Please provide a valid email."
        ]
    },
    role: {
        type: String,
        default: "user",
        enum: ["user", "admin"]
    },
    password: {
        type: String,
        minlength: [6, "Please provide a password with min length 6."],
        required: [true, "Please provide a password"],
        select: false,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    phone: {
        type: String,
    },
    about: {
        type: String,
    },
    blocked: {
        type: Boolean,
        default: false,
    },
    resetPasswordToken: {
        type: String,
    },
    resetPasswordExpire: {
        type: Date,
    },
    notification_token: {
        type: String,
        required: true
    },
    profile_image_string: {
        type: String,
        default: "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"
    }
});

// UserSchema Methods

UserSchema.methods.generateJwtFromUser = function () {
    const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
    const payload = {
        id: this._id,
        name: this.name
    };

    const token = jwt.sign(payload, JWT_SECRET_KEY, {
        expiresIn: JWT_EXPIRE
    });

    return token;
};
UserSchema.methods.getResetPasswordTokenFromUser = function () {
    const randomHexString = crypto.randomBytes(15).toString("hex");
    const {RESET_PASSWORD_EXPIRE} = process.env;

    const resetPasswordToken = crypto
    .createHash("SHA256")
    .update(randomHexString)
    .digest("hex");
    
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordExpire = Date.now() + parseInt(RESET_PASSWORD_EXPIRE);

    return resetPasswordToken;
};
UserSchema.pre("save", function (next) {
    // Parola de??i??memi??se 
    if (!this.isModified("password")) {
        next();
    }
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            next(err);
        }
        bcrypt.hash(this.password, salt, (err, hash) => {
            if (err) {
                next(err);
            }
            this.password = hash;
            next();
        });
    });
});
UserSchema.post("remove", async function(){

    await Recipe.deleteMany({
        user: this._id
    });


});
module.exports = mongoose.model("User", UserSchema);