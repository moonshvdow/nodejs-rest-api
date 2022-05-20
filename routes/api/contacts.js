const express = require("express");

const {Contact, addSchema, updateFavoriteSchema} = require('../../models/contacts')
const { createError } = require("../../helpers");

const router = express.Router();



router.get("/", async (req, res, next) => {
  try {
    const result = await Contact.find({}, "-createdAt -updatedAt");
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const result = await Contact.findById(contactId, "-createdAt -updatedAt");;
    if(!result){
        throw createError(404);
    }
    res.json(result);
} catch (error) {
   next(error);
}
});

router.post("/", async (req, res, next) => {
  try {
    const {error} = addSchema.validate(req.body);
    if(error){ 
        throw createError(400, error.message);
    }
    const result = await Contact.create(req.body);
    res.status(201).json(result);
} catch (error) {
    next(error);
}
});

router.delete("/:contactId", async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const result = await Contact.findByIdAndRemove(contactId);
    if(!result){
        createError(404);
    }
    res.json({
        message: "contact deleted"
    })
} catch (error) {
    next(error);
}
});

router.put("/:contactId", async (req, res, next) => {
  try {
    const {error} = addSchema.validate(req.body);
    if(error){ 
        throw createError(400, error.message);
    }
    const {contactId} = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
    if(!result){
        throw createError(404);
    }
    res.json(result);
} catch (error) {
    next(error);
}
});

router.patch("/:contactId/favorite", async(req, res, next) => {
  try {
      const {error} = updateFavoriteSchema.validate(req.body);
      if(error){ 
          throw createError(400, error.message);
      }
      const {contactId} = req.params;
      const result = await Contact.findByIdAndUpdate(contactId, req.body, {new: true});
      if(!result){
          throw createError(404);
      }
      res.json(result);
  } catch (error) {
      next(error);
  }
})
module.exports = router;
