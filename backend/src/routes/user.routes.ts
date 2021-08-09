import express from 'express';
import { UserControler } from '../controlers/user.controler';

const userRouter = express.Router();

userRouter.route('/login').post(
    (req, res) => new UserControler().login(req, res)
);

userRouter.route('/register').post(
    (req, res) => new UserControler().register(req, res)
);

export default userRouter;