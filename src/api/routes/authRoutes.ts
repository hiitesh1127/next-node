import {Request, Response, NextFunction} from 'express'
import createHttpError from 'http-errors';
import { Router } from "express";
 
import User from '../models/userModel'
import {userSchema} from '../helpers/validation'
import {signAccessToken, signRefreshToken, verifyRefreshToken} from '../helpers/jwt'

const router = Router()

router.post('/signup', async(req : Request, res : Response, next : NextFunction) => {
    try {
        const result = await userSchema.validateAsync(req.body)
        const currentUser = await User.findOne({email : result.email});

        if(currentUser)
            throw new createHttpError.BadRequest("already exist");

        const user = new User(result);
        const saveUser = await user.save()
        const accessToken = await signAccessToken(saveUser.id, saveUser.email)
        const refreshToken = await signRefreshToken(saveUser.id, saveUser.email)

        res.send({accessToken, refreshToken})

    } catch (error) {
        next(error)
    }
})

router.post('/login', async(req, res, next) => {
    try {
        const result = await userSchema.validateAsync(req.body)
        const user = await User.findOne({email : result.email})
        if(!user)
            throw new createHttpError.NotFound('Email is not registered')
        const password = result.password;
        if(password != user.password)
            throw new createHttpError.Unauthorized('Username/Password is not correct')
        const accessToken = await signAccessToken(user.id, user.email)
        const refreshToken = await signRefreshToken(user.id, user.email)

        res.send({accessToken, refreshToken})
    } catch (error) {
        next(error);
    }
}) 

router.post('/refresh', async(req, res, next) => {
    try {
        const {refreshToken} = req.body
        console.log(refreshToken)
        if(!refreshToken)
            throw new createHttpError.BadRequest();
        const user : any = await verifyRefreshToken(refreshToken)
        console.log(user)
        const accessToken = await signAccessToken(user.id, user.email)
        const refToken = await signRefreshToken(user.id, user.email)

        res.send({accessToken, refreshToken : refToken})
    } catch(error) {
        next(error)
    }
})

export default router;
