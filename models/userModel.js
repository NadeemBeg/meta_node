const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    min: 3,
    max: 20,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    max: 50,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  metamask: {
    type: String,
    required: false,
  },
  isAvatarImageSet: {
    type: Boolean,
    default: false,
  },
  avatarImage: {
    type: String,
    default: "",
  },
  device_token:{
    type: String,
    required: false,
  },
  otp: {
    type: Number,
    default: null,
  },
  newMsgUserId: {
    type: Array,
    default: [],
  },
  chatTime: {
    type: Date,
    default: new Date(),
  },
});

module.exports = mongoose.model("Users", userSchema);
