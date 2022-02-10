import {Request, Response, NextFunction} from 'express'
import createHttpError from 'http-errors'
const jwt = require('jsonwebtoken')
const client = require('../helpers/redis');

const signAccessToken = (userId : string, email : string) => {
    return (
        new Promise((resolve, reject) =>{
            const secret = process.env.JWT_ACCESS_TOKEN;
            const payload = {
                userId,
                email
            }
            const options = {
                expiresIn : '10min',
            }
            jwt.sign(payload, process.env.JWT_ACCESS_TOKEN, options, (err : any, token : string) => {
                if(err) return reject(err)
                resolve(token)
            })
        })
    )
}
const verifyAccessToken = async(req : any, res : Response, next : NextFunction)  => {
    const authHeader = req.headers['authorization']
    if(!authHeader)
        return next(new createHttpError.Unauthorized())
    const token = authHeader.split(' ')[1]

    jwt.verify(token, process.env.JWT_ACCESS_TOKEN, (err : any, payload : any) => {
        if(err) 
            return next(new createHttpError.Unauthorized(err.message))
        req.payload = payload;
        next()
    })
}

const signRefreshToken = (userId : string, email : string) => {
    return (
        new Promise((resolve, reject) =>{
            const payload = {
                userId,
                email
            }
            const options = {
                expiresIn : '7d',
            }
            jwt.sign(payload, process.env.JWT_REFRESH_TOKEN, options, async (err : any, token : string) => {
                if(err) return reject(err)
                //await client.set(userId, token)
                client.set(userId, token, 'EX', 7*24*60*60 , (err : any, data : string) => {
                    console.log("data  ", data)
                    if(err)
                        return reject(new createHttpError.InternalServerError());
                })
                resolve(token)
            })
        })
    )
}

const verifyRefreshToken = (refreshToken : string) => {
    return (
        new Promise((resolve, reject) =>{
            jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN, (err : any, payload : any) => {
                if(err) reject(new createHttpError.BadRequest(err.message))
                console.log(payload)
                resolve(payload.userId)
            })
        })
    )
}
export {
    signAccessToken,
    verifyAccessToken,
    signRefreshToken,
    verifyRefreshToken
}