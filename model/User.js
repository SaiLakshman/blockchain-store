var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../configs').secret;

/**
 * schema for users can be used for both client and server
 * hash & salt is nothing just to authinticate pasword using encryption
 */

var UserSchema = new mongoose.Schema({
  email: { type: String, lowercase: true, unique: true, required: [true, "an't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true },
  bio: String,
  image: String,
  role: String, 
  hash: String,
  salt: String,
  publicKey : String,
  privateKey:String,
  resetPasswordToken: String,
  resetPasswordExpires: String,
  isEmailVerified: { type: Boolean, default: false },
  isUserApproved: { type: Boolean, default: false },

}, { timestamps: true });

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

UserSchema.methods.validPassword = function (password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};

UserSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.generateJWT = function () {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    email: this.email,
    role: this.role,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};


UserSchema.methods.toAuthJSON = function () {
  return {
    username: this.username,
    email: this.email,
    token: this.generateJWT(),
    bio: this.bio,
    role: this.role,
    image: this.image
  };
};

mongoose.model('users', UserSchema);
