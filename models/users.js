const {Schema, model} = require('mongoose')
const Joi = require("joi");

const emailRegexp = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

const subscription = ["starter", "pro", "business"];

const userSchema = Schema({
    password: {
      type: String,
      minlength: 6,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      match: emailRegexp,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: subscription,
      default: "starter"
    },
    token: {
      type: String,
      default: null,
    },
  }, {versionKey: false, timestamps: true});

  const User = model('user', userSchema);

  const addUserSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().valueOf(...subscription),
    token: Joi.string()
});

  module.exports = { User, addUserSchema };