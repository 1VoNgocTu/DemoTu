const express = require('express')
const router = express.Router()
//const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const CryptoJS = require("crypto-js")

const { generateToken, updateRefreshToken} = require('../models/Token')
const verifyToken = require('../middleware/auth/index')
const { response } = require('express')

const Validator = require("fastest-validator")

const v = new Validator()
const { auth, post} = require('../validator')
const check = v.compile(auth)

// @route POST api/auth/register
// @decs Register user
// @access public
router.post('/register', async (req, res) => {
    const { username, password } = req.body
    const kq = check({ username, password })
    if(kq != true) 
    //return res.status(400).json({ success: false, message: 'Missing username and/or password'})
    return res.transform(null, { status: 400, msg: kq})

    try {
        const user = await User.findOne({ username })
        if(user)
        //return res.status(400).json({ success: false, message: 'Username already taken'})
        return res.transform(null,{ status: 400, msg: 'Username already taken'})
        // Mã hóa mk
        const hashPassword = await CryptoJS.AES.encrypt(password, 'secret key 123').toString()
        const bytes  = CryptoJS.AES.decrypt(hashPassword, 'secret key 123')
        const originalText = bytes.toString(CryptoJS.enc.Utf8);
        const newUser = await User({ username, password: hashPassword })
        await newUser.save()

        // token 
        const accessToken = jwt.sign(
            {userId: newUser._id}, 
            process.env.ACCESS_TOKEN_SECRET, 
            {expiresIn: '30s'}
        )

        //res.json({ success: true, message: 'User created successfully', accessToken, originalText})
        return res.transform(newUser,{ msg: 'User created successfully'})
        //return res.ServiceNotFound()
    } catch (error) {
        console.log(error)
        //return res.status(500).json({ success: false, message: 'Internal server error'})
        return res.transform(null, { status: 500, msg: 'Internal server error'})
    }
})

// @route POST api/auth/login
// @decs Login user
// @access public
router.post('/login', async (req, res) => {
    const { username, password } = req.body

    if(!username || !password) 
    return res.status(400).json({ success: false, message: 'Missing username and/or password'})

    try {
        const user = await User.findOne({ username})
        if(!user)
        return res.status(400).json({ success: false, message: 'Incorrect username'})
        const passwordValid = await argon2.verify(user.password, password)
        if(!passwordValid)
        return res.status(400).json({ success: false, message: 'Incorrect password'})

        const tokens = generateToken(user)
        updateRefreshToken(username, tokens.refreshToken)

        res.json({ success: true, message: 'User logged in successfully', tokens})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal server error'})
    }
})

// Lấy token mới khi token hết hạn
router.post('/token', async (req, res) => {
    const refreshToken = req.body.refreshToken

    const user = await User.findOne({ refreshToken})
    if(!user)
    return res.status(403)

    try {
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const tokens = generateToken(user)
        updateRefreshToken(user.username, tokens.refreshToken)
        res.json(tokens)
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal server error'})
    }
})

// @route DELETE api/auth/logout
// @decs Logout user
// @access private
router.delete('/logout',verifyToken, async (req, res) => {
    // Xóa token
    const user = await User.findOne(req.username)
    updateRefreshToken(user.username, null)
})

module.exports = router