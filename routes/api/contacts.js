const express = require("express");

const {Contact, addSchema, updateFavoriteSchema} = require('../../models/contacts')
const { createError } = require("../../helpers");
const {auth} = require('../../middlewares')

const router = express.Router();



router.get("/", auth, async (req, res, next) => {
  try {
    const {page, limit, favorite} = req.query;
    const skip = (page - 1) * limit;
    const {_id} = req.user;
    if(favorite === true){
      const result = await Contact.find({owner: _id, favorite: true}, "-createdAt -updatedAt", {skip, limit: Number(limit)}).populate('owner', 'email');
      res.json(result);
      return;
    }
    const result = await Contact.find({owner: _id}, "-createdAt -updatedAt", {skip, limit: Number(limit)}).populate('owner', 'email');
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", auth, async (req, res, next) => {
  try {
    const {contactId} = req.params;
    const result = await Contact.findById(contactId, "-createdAt -updatedAt");
    if(!result){
        throw createError(404);
    }
    res.json(result);
} catch (error) {
   next(error);
}
});

router.post("/", auth, async (req, res, next) => {
  try {
    const {error} = addSchema.validate(req.body);
    if(error){ 
        throw createError(400, error.message);
    }
    const result = await Contact.create({...req.body, owner: req.user._id});
    res.status(201).json(result);
} catch (error) {
    next(error);
}
});

router.delete("/:contactId", auth, async (req, res, next) => {
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

router.put("/:contactId", auth, async (req, res, next) => {
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

router.patch("/:contactId/favorite", auth, async(req, res, next) => {
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
