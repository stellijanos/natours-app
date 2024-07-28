const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
});

userSchema.pre('save', async function (next) {
    // only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 16);

    // delete the passwordConfirm field
    this.passwordConfirm = undefined;
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

const User = mongoose.model('User', userSchema);

module.exports = User;
