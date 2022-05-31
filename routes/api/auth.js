const express = require('express');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require("path");
const fs = require("fs/promises");
const Jimp = require("jimp");

const { createError } = require("../../helpers");

const {addUserSchema, User} = require('../../models/users')
const { auth, upload } = require('../../middlewares')

const {SECRET_KEY} = process.env;

const router = express.Router();

router.post('/signup', async(req, res, next) => {
    try {
        const {error} = addUserSchema.validate(req.body);
        if(error) {
            throw createError(400, error.message);
        }
        const {email, password, subscription} = req.body;
        const user = await User.findOne({email});
        if(user) {
            throw createError(409, "Email in use");
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const avatarURL = gravatar.url(email)
        const result = await User.create({email, password: hashPassword, subscription, avatarURL});
        res.status(201).json({
            user: {
                email: result.email,
                subscription: result.subscription
            }
        }
        )
    } catch (error) {
        next(error);
    }
});

router.post("/login", async(req, res, next)=> {
    try {
        const {error} = addUserSchema.validate(req.body);
        if(error) {
            throw createError(400, error.message);
        }
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user){
            throw createError(401, "Email or password is wrong");
        }
        const passwordCompare = await bcrypt.compare(password, user.password);
        if(!passwordCompare){
            throw createError(401, "Email or password is wrong");
        }
        const payload = {
            id: user._id
        }
        
        const token = jwt.sign(payload, SECRET_KEY, {expiresIn: "1h"});
        await User.findByIdAndUpdate(user._id, {token});
        res.json({
            token,
            user: {
                email: user.email,
                subscription: user.subscription
            }
        })
    } catch (error) {
        next(error);
    }
})

const avatarsDir = path.join(__dirname, "../../", "public", "avatars");

router.patch("/avatars", auth, upload.single("avatar"), async(req, res, next)=> {
    try {
        const {_id} = req.user;
        const {path: tempDir, filename} = req.file;
        const [extension] = filename.split(".").reverse();
        const name =`${_id}.${extension}`;
        const resultDir = path.join(avatarsDir, name);
        await fs.rename(tempDir, resultDir);
        const image = await Jimp.read(resultDir);
        await image.resize(250, 250).write(resultDir);
        const avatarURL = path.join("avatars", name);
        await User.findByIdAndUpdate(_id, {avatarURL});
        res.json({
            avatarURL
        })
    } catch (error) {
        
    }
})

router.get('/current', auth, async(req,res,next) => {
    try {
        const {email, subscription} = req.user;
        res.json({
            email,
            subscription
        })
    } catch (error) {
        next(error)
    }
});


router.get("/logout", auth, async(req, res, next)=> {
    try {
        const {_id} = req.user;
        await User.findByIdAndUpdate(_id, {token: null});
        res.status(204).json();
    } catch (error) {
        next(error);
    }
})

module.exports = router;