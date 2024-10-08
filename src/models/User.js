const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    avatar:{ 
        type: String,
        default: ""
    },
    scorePoints: {
        type:  String, 
        default: 0
    }, 
    email: {
        type: String, 
        required: true,
        unique: true
    },
    password: {
        type: String
    },
      passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
})

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


const User = mongoose.model("User", userSchema)
module.exports = User