import cors from 'cors';
import {config} from 'dotenv'
import express, {Request, Response, NextFunction, Application, ErrorRequestHandler} from 'express'
import {Server} from 'http'
import createHttpError from 'http-errors'
import {connect} from 'mongoose'
import morgan from 'morgan'

import Authentication from './api/helpers/jwt'
import AuthRoutes from './api/routes/authRoutes';

class App {
    public app : Application;
    public auth = new Authentication()
    constructor() {
        this.app = express();
        this.middlewares();
        this.routes();
        this.errroHandling();
    }

    protected middlewares() {
        config();
        this.app.use(cors())
        this.app.use(express.json())
        this.app.use(morgan('dev'))        
    }

    protected routes() {
        this.app.get('/', this.auth.verifyAccessToken, async (req : Request, res : Response, next) => {
            res.send("hello from express")
        })
        this.app.get('/ping', (req : Request, res : Response) => {
            res.json({response : "pong"})
        })
        this.app.use('/auth', new AuthRoutes().router);
    }

    protected errroHandling() {
        this.app.use((req : Request, res : Response, next : NextFunction) => {
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
        this.app.use(errorHandler)
    }
}

// connecting to database
const app = new App().app
connect(process.env.MONGO_URL as string).then(() => {
    const server : Server = app.listen((4500), () => console.log("server is running at port 4500"));
}).catch((err : any) => console.log(err.message))
