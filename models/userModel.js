const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { serialize } = require('v8');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your Email!'],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, 'Please provide a valid email address!'],
    },
    photo: {
        type: String,
        // default: 'no-image.png',
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false,
    },
    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        validate: {
            // This is only works on SAVE!!!
            validator: function (el) {
                return el === this.password;
            },
            message: 'Passwords do not match!',
        },
    },
    passwordChangedAt: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        enum: ['user', 'guide', 'lead-guide', 'admin'],
        default: 'user',
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

// userSchema.pre('save', async function (next) {
//     // only run this function if password was actually modified
//     if (!this.isModified('password')) return next();

//     // hash the password with cost of 12
//     this.password = await bcrypt.hash(this.password, 16);

//     // delete the passwordConfirm field
//     this.passwordConfirm = undefined;
//     next();
// });

// userSchema.pre('save', function (next) {
//     if (!this.isModified('password') || this.isNew) return next();

//     this.passwordChangedAt = Date.now() - 1000;
//     next();
// });

userSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
    if (this.passwordChangedAt) {
        const changedTimeStamp = parseInt(
            this.passwordChangedAt.getTime() / 1000,
            10,
        );
        return JWTTimeStamp < changedTimeStamp;
    }
    return false;
};

userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    console.log({ resetToken }, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
