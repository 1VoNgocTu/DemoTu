const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth')
const Post = require('../models/Post')
const Validator = require("fastest-validator")

const v = new Validator();
const { auth, post} = require('../validator')
const check = v.compile(post)

// @route POST api/posts
// @decs Create post
// @access private
router.post('/', verifyToken, async (req, res) => {
    const { title, description, url, status } = req.body

    // if(!title) 
    // return res.status(400).json({ success: false, message: 'Title is required'})
    

    try {
        const newPost =  new Post({ title, 
            description, 
            url: (url.startsWith('http://')) ? url: `http://${url}`,
            status: status || 'TO LEARN',
            user: req.userId
        })
        
        await newPost.save()
        res.json({ success: true, message: 'Happy learning', post: newPost })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Internal server error'})
    }
})

module.exports = router