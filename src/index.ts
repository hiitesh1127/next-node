import 'dotenv/config'
import cors from 'cors';
import express, {Request, Response, NextFunction, Application, ErrorRequestHandler} from 'express'
import {Server} from 'http'
import createHttpError from 'http-errors'
import {connect} from 'mongoose'
import morgan from 'morgan'

import authRoutes from './api/routes/authRoutes'
import {verifyAccessToken} from './api/helpers/jwt'

const app : Application = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))


//routes
app.use('/auth', authRoutes)


// home route
app.get('/', verifyAccessToken, async (req : Request, res : Response, next) => {
    res.send("hello from express")
})


// handling error
app.use((req : Request, res : Response, next : NextFunction) => {
    next(new createHttpError.NotFound("This route does't exist"));
})

const errorHandler : ErrorRequestHandler = (err, req, res, next) => {
    res.status(err.status || 500) 
    res.send( {
        error : {
            status : err.status || 500,
            message : err.message
        }
    })
}

app.use(errorHandler)


// connecting to database
connect(process.env.MONGO_URL!).then(() => {
    const server : Server = app.listen((4500), () => console.log("server is running at port 4500"));
}).catch((err) => console.log(err.message))
