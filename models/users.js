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
    avatarURL: {
      type: String,
      required: true
    },
    token: {
      type: String,
      default: null,
    },
      verify: {
        type: Boolean,
        default: false,
      },
      verificationToken: {
        type: String,
        required: [true, 'Verify token is required'],
      },
  }, {versionKey: false, timestamps: true});

  const User = model('user', userSchema);

  const addUserSchema = Joi.object({
    email: Joi.string().pattern(emailRegexp).required(),
    password: Joi.string().min(6).required(),
    subscription: Joi.string().valueOf(...subscription),
    avatarURL: Joi.string().required(),
    token: Joi.string(),
    verify: Joi.boolean(),
    verificationToken: Joi.string().required()
});


const emailVerifySchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
})

  module.exports = { User, addUserSchema, emailVerifySchema };