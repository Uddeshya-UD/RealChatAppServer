const User = require("../models/Users");
const jwt = require("jsonwebtoken");
const express = require("express"); // You need to import 'express' to access the 'res' object.
const { encodeBase64 } = require("bcrypt");

const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: "", password: "" };

  // incorrect email 
  if(err.message === `Incorrect email`){
    errors.email = `The email is not registered`
  }

  // incorrect password 
  if(err.message === `Incorrect password`){
    errors.password = `The password is incorrect`
  }
  // Duplicate error
  if (err.code === 11000) {
    errors.email = "This email is already registered";
    return errors;
  }

  // Validation error
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || "This_is_the_secret_key"

// create json web token
const maxAge = 3 * 24 * 60 * 60;
const createToken = (id,email) => {
  const payload = { 
                        userId: id,
                        email: email
                 }  
  return jwt.sign(payload, JWT_SECRET_KEY, { expiresIn: 84600,});
};

const login_get = (req, res, next) => {
  res.render("login");
};

const login_post = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email,password)

            const payload = { 
                userId: user._id,
                email: user.email
        }  
        const token = createToken(user._id);

        console.log("Token: ",token)

        if(token){
            const result = await User.updateOne(
                { _id: user._id },
                { $set: { token: token } }
            );
    
            console.log('Token updated successfully', result);
            res.cookie(payload, token, { httpOnly: false, maxAge: maxAge * 1000 });
            res.status(200).json({user, token});
        } else {
        const errors = handleErrors(err);
        res.status(400).json({ errors });
        }
    
  } 
  
  catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({ errors });
  }
};

const signin_get = (req, res, next) => {
  res.render("signup");
};

const signin_post = (req, res, next) => {
  const {fullName, email, password } =
    req.body;

  let user = new User({
    fullName: fullName,
    email: email,
    password: password,
  });

  console.log("User : " + user);
  user
    .save()
    .then((result) => {
      const token = createToken(result._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      console.log("Added User Successfully" + result);
      res.status(201).json({ user: result._id }); // Use 'result' instead of 'user'
    })
    .catch((err) => {
      const errors = handleErrors(err);
      res.status(400).json({ errors });
    });
};

module.exports = { login_post, login_get, signin_get, signin_post };