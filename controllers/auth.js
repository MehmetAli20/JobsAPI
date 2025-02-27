const { BadRequestError, UnauthenticatedError} = require('../errors')
const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const register = async (req,res) => {
    const user = await User.create({...req.body})
      
    const token = user.createJWT()

    res.status(StatusCodes.CREATED).json({userId:user._id,user:{name:user.name},token})
}
const login = async (req,res) => {

    const { email, password } = req.body

    if(!email || !password){
        throw new BadRequestError('Please provide email and password')
    }
    
    const user = await User.findOne({email})

    if(!user){
        throw new UnauthenticatedError('No Authorization given, invalid credentials')
    }

    const comparePassword = await user.comparePassword(password)

    if(!comparePassword){
        throw new UnauthenticatedError('Password incorrect. ')
    }
    const token = user.createJWT()
    res.status(StatusCodes.OK).json({userId:user._id,user:{name:user.name},token})
}

module.exports={
    register,login
}
