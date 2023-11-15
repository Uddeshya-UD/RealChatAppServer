const mongoose = require("mongoose");
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({

   
  fullName: {
    type: String,
    required: [true, " Please enter your full name "]
  }, 

  email: {
    type: String,
    required: [true, " Please enter an email address "],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please Enter a Valid Email"],
  },
  password: {
    type: String,
    required: [true, " Please enter a password "],
    minlength: 6,
  },

  token: {
    type: String
  }
});

// static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
  
    console.log(password , "---" , user.password)
    if (user) {
      // if user found
      // compare password
      const auth = await bcrypt.compare(password, user.password);
      if (auth) {
        return user;
      }
      throw Error("Incorrect password");
    }
    // if user not found
    throw Error("Incorrect email");
  };

userSchema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.post("save", function (doc, next) {
  console.log("New User was created and Saved to DB", doc);
  next();
});



const User = mongoose.model("User", userSchema);

module.exports = User;