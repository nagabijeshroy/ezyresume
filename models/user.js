var mongoose = require('mongoose');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var autoIncrement = require('mongoose-auto-increment');

var UserSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    userId: Number,
    username: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    hash: String,
    salt: String,
    firstName: String,
    LastName: String,
    email: {
        type: String,
        required: true,
        unique: true
    }
});

UserSchema.methods.setPassword = function(password){
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
  return this.hash === hash;
};

userSchema.methods.generateJwt = function() {
  var expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);

  return jwt.sign({
    _id: this._id,
    username: this.username,
    userId: this.userId,
    exp: parseInt(expiry.getTime() / 1000),
  }, "MY_SECRET"); // DO NOT KEEP YOUR SECRET IN THE CODE!
};

var UserModel = mongoose.model("user", UserSchema);

UserSchema.plugin(autoIncrement.plugin, {
    model: 'user',
    field: 'userId',
    startAt: 122016,
    incrementBy: 1
});

module.exports = UserModel;
