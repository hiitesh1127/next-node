import { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import { Router } from "express";

import User from "../models/userModel";
import { userSchema } from "../helpers/validation";
import Authentication from "../helpers/jwt";

class AuthRoutes {
  public router = Router();
  public auth = new Authentication();
  constructor() {
    this.authRoutes();
  }

  private authRoutes() {
    this.router.post("/signup", this.signup);
    this.router.post("/login", this.login);
    this.router.post("/refresh", this.refresh);
  }

  private signup = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await userSchema.validateAsync(req.body);
      const currentUser = await User.findOne({ email: result.email });

      if (currentUser) throw new createHttpError.BadRequest("already exist");

      const user = new User(result);
      const saveUser = await user.save();
      const accessToken = await this.auth.signAccessToken(
        saveUser.id,
        saveUser.email
      );
      const refreshToken = await this.auth.signRefreshToken(
        saveUser.id,
        saveUser.email
      );

      res.send({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  };

  private login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await userSchema.validateAsync(req.body);
      const user = await User.findOne({ email: result.email });
      if (!user) throw new createHttpError.NotFound("Email is not registered");
      const password = result.password;
      if (password != user.password)
        throw new createHttpError.Unauthorized(
          "Username/Password is not correct"
        );
      const accessToken = await this.auth.signAccessToken(user.id, user.email);
      const refreshToken = await this.auth.signRefreshToken(
        user.id,
        user.email
      );

      res.send({ accessToken, refreshToken });
    } catch (error) {
      next(error);
    }
  };

  private refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      console.log(refreshToken);
      if (!refreshToken) throw new createHttpError.BadRequest();
      const user: any = await this.auth.verifyRefreshToken(refreshToken);
      console.log(user);
      const accessToken = await this.auth.signAccessToken(user.id, user.email);
      const refToken = await this.auth.signRefreshToken(user.id, user.email);

      res.send({ accessToken, refreshToken: refToken });
    } catch (error) {
      next(error);
    }
  };
}

export default AuthRoutes;
