const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            lowercase: true,
            trim: true
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
            lowercase: true
        },
        firstName: {
            type: String,
            required: true,
            trim: true
        },
        lastName: {
            type: String,
            required: true,
            trim: true
        },
        googleId: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

userSchema.statics.authenticate = async function(details) {
    if (!details)
        return null;
    
    // auth with google
    if (!details.googleId) {
        let user = await this.findOne({
            googleId: details.googleId
        });

        if (!user) {
            // check if another acct exists with the same email address
            if (details.email) {
                let user = await this.findOne({
                    email: details.email
                });

                if (user) {
//                    this.
                }
           }
        }
    }
};

const User = mongoose.model('User', userSchema);

module.exports = User;
