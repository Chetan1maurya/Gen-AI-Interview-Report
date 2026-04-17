import userModel from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import tokenBlacklistModel from '../models/blacklist.model.js'

/**
 * @name registerUserController
 * @description Register a new user, expects username, email and password
 * @access Public
 */
export const registerUserController = async(req, res) => {
    const {username, email, password} = req.body
    if(!username || !email || !password){
        return res.status(400).json({
            message: "Please provide username, email and password"
        })
    }
    const isUserAlreadyExists = await userModel.findOne({
        $or: [{username}, {email}]
    })
    if(isUserAlreadyExists){
        if(isUserAlreadyExists.username == username){
            return res.status(400).json({
                message: "Account already exists with this username"
            })
        }
        return res.status(400).json({
            message: "Account already exists with this email address"
        })
    }
    const hash = await bcrypt.hash(password, 10)
    const user = await userModel.create({
        username, 
        email,
        password: hash
    })
    const token = jwt.sign(
        {id: user._id, username: user.username},
        process.env.SECRET_KEY,
        {expiresIn: "1d"}
    )
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    })
    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}

/**
 * @name loginUserController
 * @description login a user, expects email and password in the request body
 * @access Public
 */
export const loginUserController = async(req,res) => { 
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({
            message:"Email and password both are required"
        })
    }
    const user = await userModel.findOne({email})
    if(!user){
        return res.status(400).json({
            message: "User does not exists"
        })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if(!isPasswordValid){
        return res.status(400).json({
            message: "Password is not matching"
        })
    }
    const token = jwt.sign({id:user._id, username: user.username}, process.env.SECRET_KEY,{expiresIn:"1d"})
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    })
    return res.status(200).json({
        message: "User Successfully logged In",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

/**
 * @name loginWithGoogle
 * @description login using google
 * @access Public
 */
export const loginWithGoogle = async(req,res) => {
    const {username, email, password} = req.body;
    let user = await userModel.findOne({email});

    if(!user){
        user = await userModel.create({
            email,
            username,
            password
        });
    }

    const token = jwt.sign({id:user._id, username: user.username}, process.env.SECRET_KEY,{expiresIn:"1d"})
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None"
    })
    return res.status(200).json({
        message: "User Successfully logged In",
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
    })

}

/**
 * @name logoutUserController
 * @description clear token from user cookie and add the token in blacklist
 * @access Public
 */
export const logoutUserController = async(req, res) => {
    const token = req.cookies.token
    if(token){
        await tokenBlacklistModel.create({token})
    }
    res.clearCookie("token")
    return res.status(200).json({
        message: "User logged out successfully"
    })
}

/**
 * @name getMeController
 * @description get the current logged in user details/
 * @access private
 */
export const getMeController = async(req, res) => {
    if(req.user.id == null){
        return
    }
    const user = await userModel.findOne({ _id: req.user.id })

    res.status(200).json({
        message: "User details fetched successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email
        }
    })
}