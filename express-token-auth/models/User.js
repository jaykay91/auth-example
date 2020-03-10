const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  pw: String,
  socialId: { kakao: Number },
  message: String,
  refreshToken: String
});

module.exports = mongoose.model("User", userSchema);
