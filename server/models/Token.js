const User = require('../models/User')
const jwt = require('jsonwebtoken')

const generateToken = payload => {
    const { id, username} = payload
    const accessToken = jwt.sign(
        { id, username}, 
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '30s'}
    )

    const refreshToken = jwt.sign(
        { id, username}, 
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '1h'}
    )
    return { accessToken, refreshToken}
}

const updateRefreshToken = async (username, refreshToken) =>{
    const user = await User.findOne({ username })
    if(user){
        await User.update(
            { _id: user.id}, 
            {$set: { refreshToken: refreshToken}} 
        )
    }
    return user
}

module.exports = { generateToken, updateRefreshToken}