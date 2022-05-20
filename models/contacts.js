const {Schema, model} = require('mongoose')
const Joi = require('joi')


const contactSchema = Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  }, {versionsKey: false, timestamps: true}
);

const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
  favorite: Joi.boolean()
});

const updateFavoriteSchema = Joi.object({
  favorite: Joi.boolean().required(),
})
const Contact = model('contact', contactSchema)

module.exports = {Contact, addSchema, updateFavoriteSchema};