const mongoose = require('mongoose');
const passport = require('passport');

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
    facebookId: {
      type: number,
      required: false,
    }
  },
  {
    timestamps: true
  }
);

userSchema.statics.authenticateFacebook = async function(facebookId, cb) {
  let foundUser = await this.findOne({ facebookId: facebookId });

  if (!foundUser)
    callback('user does not exist', null);
  
  cb(null, foundUser);
};

userSchema.statics.authenticate = async function(req, cb) {
  if (!req || !req.authType)
    cb('authentication failure: request was null', null);
  
  if (req.authType === 'facebook') {
    let user = await this.findOne({ facebookId: req.facebookId });
    cb(!user ? 'user does not exist' : null, user);
  }
};

const User = mongoose.model('User', userSchema);


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

module.exports = User;
