const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  userId: {
    type: String,
    require: [true, 'userId should provide'],
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    require: [true, 'Please add a name'],
    trim: true,
  },
});

const User = (exports.User = mongoose.model('User', UserSchema));
exports.createUser = async userInfo => {
  const user = new User(userInfo);
  return user.save();
};
exports.getUser = async userId => {
  return User.findOne({ userId });
};
